<style>
.data-col.null {
  color: #bbb;
}
.data-col.number {
  text-align: right;
}
.data-col.errored {
  color: #c00;
}
.data-row.errored td:first-child::before {
  color: #c00;
  content: "*SATIR* ";
}
.data-col.errored:before {
  content: "*";
}
ul.text-small li {
  font-size: 11px;
}
</style>
<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    :hide-overlay="$vuetify.breakpoint.smAndDown"
    :transition="$vuetify.breakpoint.smAndDown ? 'dialog-bottom-transition' : null"
    :persistent="loading || !!workbook"
    v-model="visible"
    scrollable
    max-width="1200px"
  >
    <p-importer-help v-model="help" />

    <v-card tile flat style="min-height:450px;">
      <v-card-title primary-title class="headline pa-0">
        <v-toolbar dark color="primary" flat>
          <v-btn icon dark v-if="$vuetify.breakpoint.smAndDown" :disabled="loading" @click="hide">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{caption || $t('importer.importTitle')}}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn dark icon large @click="downloadTemplate" v-on="on">
                  <v-icon>photo_filter</v-icon>
                </v-btn>
              </template>
              <span>{{$t('importer.downloadTemplate')}}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn dark icon large @click="help = true" v-on="on">
                  <v-icon>help</v-icon>
                </v-btn>
              </template>
              <span>{{$t('importer.aboutShort')}}</span>
            </v-tooltip>
          </v-toolbar-items>
          <v-toolbar-items v-if="$vuetify.breakpoint.smAndDown">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn dark icon large @click="downloadTemplate" v-on="on">
                  <v-icon>photo_filter</v-icon>
                </v-btn>
              </template>
              <span>{{$t('importer.downloadTemplate')}}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn dark icon large @click="help = true" v-on="on">
                  <v-icon>help</v-icon>
                </v-btn>
              </template>
              <span>{{$t('importer.aboutShort')}}</span>
            </v-tooltip>
            <v-btn
              dark
              text
              large
              style="height:56px"
              :loading="loading"
              :disabled="!readyToImport"
              @click="importData"
              v-if="!done"
            >{{$t("importer.import")}}</v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 6">
              <v-form ref="form">
                <div
                  @drop.prevent="addDropFile"
                  @dragover.prevent
                  @dragenter="dragEnter"
                  @dragleave="dragLeave"
                  @dragover="dragEnter"
                >
                  <v-file-input
                    @change="fileInputChange"
                    @click:clear="reset()"
                    v-model="xlsfile"
                    :label="fileInputLabel"
                    show-size
                    counter
                    :disabled="loading"
                    :accept="acceptedFormats"
                  ></v-file-input>
                </div>
              </v-form>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.smAndDown ? 6 : 2">
              <v-select
                v-model="sliceBy"
                :items="[10,50,100,250,500,1000]"
                :label="$t('importer.paginate')"
                :disabled="loading"
              ></v-select>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.smAndDown ? 6 : 4">
              <v-row>
                <v-col style="padding-top:0; padding-bottom:0">
                  <p-spinner
                    :min="0"
                    :max="99"
                    :step="1"
                    v-model="skipFirstRows"
                    :disabled="loading || !!workbook"
                    :label="$t('importer.skipFromTop')"
                  />
                </v-col>
                <v-col style="padding-top:0; padding-bottom:0">
                  <p-spinner
                    :min="0"
                    :max="99"
                    :step="1"
                    v-model="skipLastRows"
                    :disabled="loading || !!workbook"
                    :label="$t('importer.skipFromBottom')"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="loading">
            <v-col>
              <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
            </v-col>
          </v-row>
          <!-- PARSING LISTING -->
          <v-row align="start">
            <v-col cols="1" v-if="workbook || done" style="max-width:35px">
              <v-icon>fa fa-file-excel-o</v-icon>
            </v-col>
            <v-col cols="6" v-if="workbook">
              <span
                style="display:block"
              >{{workbook.Props.Application}} - {{workbook.Props.AppVersion}}</span>

              <small>{{$t('importer.parseDetail',{page: workbook.SheetNames.length, sheet: workbook.SheetNames[0],length: parsedJson[workbook.SheetNames[0]].length })}}</small>
              <small style="display:block">
                {{$t('importer.lastChange')}} {{utils.formatDateTime(workbook.Props.ModifiedDate)}}
                <span
                  v-show="workbook.Props.Author"
                >, {{$t('importer.byWhom',{who: workbook.Props.Author})}}</span>
                <span v-if="timePassed > 0">, {{$t('importer.tookSeconds',{seconds: timePassed})}}</span>
                <span v-else>, {{$t('importer.tookLessThenOneSecond')}}</span>
              </small>
            </v-col>
            <v-col>
              <v-row v-if="workbook" align="start" no-gutters>
                <v-col cols="1" style="max-width:35px">
                  <v-icon v-if="errorCount > 0" color="error">warning</v-icon>
                  <v-icon v-else color="success">info</v-icon>
                </v-col>
                <v-col>
                  <span style="display:block;font-weight:bold">{{$t('importer.parseStatus')}}</span>
                  <small v-if="errorCount > 0">
                    {{$t('importer.nErrorsFound',{count:errorCount})}}
                    {{$t('importer.fieldsWithErrorsShownOnTable')}}
                    <br />
                    <ul v-if="computedListedErrors">
                      <li
                        v-for="(error,index) in computedListedErrors"
                        v-bind:key="index+'_err'"
                      >{{error}}</li>
                    </ul>
                    <v-btn
                      @click="saveErrors"
                      small
                      v-if="workbook && !done && computedListedErrors.length != listedErrors.length"
                      text
                      style="margin:20px 0"
                    >
                      <v-icon>cloud_download</v-icon>
                      {{ $t('importer.downloadUnshownErrors')}}
                    </v-btn>
                  </small>
                  <small v-else>
                    {{$t('importer.nRowsRead',{count: parsedJson[workbook.SheetNames[0]].length})}}
                    <br />
                    {{$t('importer.pressLoadButtonToContinue')}}
                  </small>
                </v-col>
              </v-row>

              <v-row v-if="done" align="start" no-gutters>
                <v-col cols="1" style="max-width:35px">
                  <v-icon color="success">check_circle</v-icon>
                </v-col>
                <v-col>
                  <span style="display:block;font-weight:bold">{{$t('importer.parseStatus')}}</span>
                  <small>{{$t('importer.rowsUpdated')}}</small>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider style="margin-left:35px" v-if="workbook" />
          <v-row>
            <v-spacer />
            <v-col v-if="errorCount > 0" cols="auto">
              <v-checkbox v-model="showOnlyErrorLines" :label="$t('importer.showOnlyErorrLines')"></v-checkbox>
            </v-col>
          </v-row>
          <v-simple-table
            :key="simpleTableKey"
            v-if="workbook && !loading"
            style="margin-left:35px"
            dense
          >
            <template v-slot:default>
              <thead :key="simpleTableTheadKey">
                <tr>
                  <th v-for="(item,index) in columns" :key="item.source" class="text-left">
                    <v-text-field
                      :ref="'filterItems_'+item.source"
                      v-show="filteredItems[item.source]"
                      v-model="filters[index]"
                      :label="item.label"
                      @blur="filterItemBlur(item,index)"
                      dense
                      flat
                      clearable
                      style="min-width:100px;font-weight:normal;margin-top:5px"
                    ></v-text-field>
                    <span
                      v-show="!filteredItems[item.source]"
                      style="cursor:pointer"
                      @click="setItemFilterable(item)"
                    >{{item.label}}</span>
                  </th>
                </tr>
              </thead>
              <tbody v-for="(sheetdata,indexSd) in computedParsedJson" :key="indexSd + '_sd'">
                <tr
                  v-for="(row,indexRd) in sheetdata"
                  :key="indexRd + '_rd'"
                  class="data-row"
                  :title="computedParsedJsonStatuses[indexSd][indexRd][row.length]"
                  v-bind:class="{ 
                        errored: 
                        computedParsedJsonStatuses[indexSd][indexRd][row.length] != null
                        }"
                >
                  <td
                    v-for="(col,indexCd) in row"
                    :key="indexCd + '_cd'"
                    class="data-col"
                    v-bind:class="{ 
                        null: (col == 'NULL'), 
                        number: (columns[indexCd] && ['int','float'].indexOf(columns[indexCd].format) > -1 ),
                        errored: computedParsedJsonStatuses[indexSd][indexRd][indexCd] != null
                        }"
                  >
                    <span
                      :title="computedParsedJsonStatuses[indexSd][indexRd][indexCd]"
                    >{{formatCol(col,indexCd)}}</span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-row v-if="workbook && !loading">
            <v-col>
              <div style="margin:0 auto; width:90%;padding-left:35px">
                <v-pagination v-model="slicePage" :length="totalPage" circle></v-pagination>
              </div>
            </v-col>
          </v-row>
          <!-- END OF PARSED LISTING-->
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-3"
          text
          v-if="$vuetify.breakpoint.mdAndUp"
          :disabled="loading"
          @click="hide"
        >{{$t("actions.close")}}</v-btn>
        <div v-if="$vuetify.breakpoint.mdAndUp">
          <v-btn
            color="primary"
            style="min-width:100px"
            :loading="loading"
            :disabled="!readyToImport"
            @click="importData"
            v-if="!done"
          >{{$t("importer.import")}}</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Vue from "vue";
import moment from "moment";

import pImporterHelp from "./parts/p-importer-help";

import saveAs from "file-saver";
import XLSX_MAIN from "xlsx";

export default {
  name: "p-importer",
  components: {
    "p-importer-help": pImporterHelp
  },
  props: {
    caption: {
      type: String,
      required: false,
      default: () => null
    },
    label: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    endpoint: {
      type: String,
      required: false,
      default: () => "/api/batchSaveDummyData"
    },
    columns: {
      type: Array,
      required: true
      /*  { 
            String label, 
            String source, 
            Boolean required, 
            String format [float,int,date,datetime]
            Callable validation 
        }, */
    },
    sheetsToParse: {
      type: Number,
      required: false,
      default: () => 1 //0 for unlimeted. TODO: No support for now
    },
    refreshHook: {
      type: Function,
      required: false,
      default: null
    },
    rowValidation: {
      type: Function,
      required: false,
      default: null
    }
  },
  data: vm => ({
    simpleTableKey: 0,
    simpleTableTheadKey: -1,
    filteredItems: {},
    filters: {},
    fileInputLabel: vm.$t("importer.chooseFile"),
    xlsfile: null,
    visible: false,
    loading: false,
    finalLoading: false,
    workbook: null,
    parsedJson: null,
    parsedJsonStatuses: null,
    errorCount: 0,
    listedErrors: [],
    done: false,
    timePassed: 0,
    timerInterval: null,
    skipFirstRows: 0,
    skipLastRows: 0,
    slicePage: 1,
    sliceBy: 250,
    help: false,
    anyDataImported: false,
    showOnlyErrorLines: false,
    columnSourceColumnOrderMap: {},
    messageRequired: vm.$t("importer.required"),
    messageNotFloat: vm.$t("importer.notFloat"),
    messageNotInt: vm.$t("importer.notInt"),
    messageNotDate: vm.$t("importer.notDate")
  }),
  computed: {
    acceptedFormats() {
      //also accepts xlt, xla, dif, slk files.

      var arr = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
        "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
        "application/vnd.ms-excel.template.macroEnabled.12",
        "application/vnd.ms-excel.addin.macroEnabled.12",
        "application/vnd.oasis.opendocument.spreadsheet",
        "application/xml",
        "text/csv"
      ];

      return arr.join(", ");
    },
    readyToImport() {
      return (
        this.parsedJson && this.errorCount == 0 && this.listedErrors.length < 1
      );
    },
    computedParsedJson() {
      if (!this.workbook) {
        return null;
      }
      var ret = {};
      var sh = this.workbook.SheetNames[0];

      ret[sh] = this.parsedJson[sh]
        .filter((item, index) => this.filter(item, index))
        .slice(
          this.sliceBy * (this.slicePage - 1),
          this.sliceBy * this.slicePage
        );

      return ret;
    },
    computedParsedJsonStatuses() {
      if (!this.workbook) {
        return null;
      }
      var ret = {};
      var sh = this.workbook.SheetNames[0];

      ret[sh] = this.parsedJsonStatuses[sh]
        .filter((item, index) => this.filter(item, index, true))
        .slice(
          this.sliceBy * (this.slicePage - 1),
          this.sliceBy * this.slicePage
        );

      return ret;
    },
    computedListedErrors() {
      return this.listedErrors.slice(0, 5);
    },
    totalPage() {
      if (!this.workbook) {
        return false;
      }
      var sh = this.workbook.SheetNames[0];
      var totalRecords = this.parsedJson[sh].filter((item, index) =>
        this.filter(item, index)
      ).length;
      return Math.ceil(totalRecords / this.sliceBy);
    }
  },
  watch: {
    filters: {
      handler(val) {
        console.log(`filters changed ${JSON.stringify(val)}`);
      },
      deep: true
    },
    showOnlyErrorLines: {
      handler(val) {
        this.simpleTableKey++; //force redraw
      }
    },
    skipFirstRows: {
      handler(val) {
        localStorage.setItem("importer-skipFirstRows", val);
      }
    },
    skipLastRows: {
      handler(val) {
        localStorage.setItem("importer-skipLastRows", val);
      }
    },
    sliceBy: {
      handler(val) {
        localStorage.setItem("importer-sliceBy", val);
      }
    }
  },
  methods: {
    filter(item, index, getStatus = false) {
      //console.log( this.parsedJsonStatuses);
      let allow = true;
      var sh = this.workbook.SheetNames[0];

      if (this.showOnlyErrorLines) {
        allow =
          this.parsedJsonStatuses[sh][index].filter(item => item !== null)
            .length > 0;
      }
      if (getStatus) {
        item = this.parsedJson[sh][index];
      }
      for (let i in this.filters) {
        let val = this.filters[i];
        if (val) {
          console.log(`item[i]: ${item[i]}`);
          var reg = new RegExp(val, "i");
          allow =
            reg.test(item[i]) || (val.toUpperCase() == "NULL" && item[i] == "");
          //allow = (item[i] + "").toLowerCase().indexOf((val+"").toLowerCase()) > -1;
        }
      }

      return allow;
    },
    filterItemBlur(item, index) {
      if (!this.filters[index]) {
        this.filteredItems[item.source] = null;
      }
      this.simpleTableTheadKey = Math.random(); //force redraw
    },
    setItemFilterable(item) {
      // console.log(`item.source: ${item.source}`);
      this.simpleTableTheadKey = Math.random();
      this.filteredItems[item.source] = true;
      var k = "filterItems_" + item.source;

      this.$nextTick(() => {
        this.$refs[k][0].$refs.input.focus();
      });
      // this.$refs[k][0].$el.focus();

      //  console.log(this.filteredItems);
    },
    downloadTemplate() {
      var data = [];
      data.push([this.label || this.$t("importer.unnamedWorkSheet")]);

      var arHeader = [];
      var arValue = [];
      for (var colindex in this.columns) {
        var col = this.columns[colindex];

        var sample;
        switch (col.format) {
          case "date":
            sample = new Date();
            break;
          case "datetime":
            sample = new Date();
            break;
          case "int":
            sample = 99;
            break;
          case "float":
            sample = 99.99;
            break;
          default:
            sample = this.$t("importer.data");
            break;
        }
        arHeader.push(col.label);
        arValue.push(sample);
      }
      data.push(arHeader);
      data.push(arValue);

      const ws = XLSX_MAIN.utils.aoa_to_sheet(data);
      const wb = XLSX_MAIN.utils.book_new();
      XLSX_MAIN.utils.book_append_sheet(wb, ws, "Sheet 1");
      /* generate file and send to client */
      XLSX_MAIN.writeFile(
        wb,
        (this.label || this.$t("importer.unnamedWorkSheet")) + ".xlsx"
      );
    },
    dragLeave() {
      console.log("leave");
      this.fileInputLabel = this.$t("importer.chooseFile");
    },
    dragEnter() {
      console.log("enter");
      this.fileInputLabel = this.$t("importer.dropHere");
    },
    addDropFile(e) {
      this.fileInputLabel = this.$t("importer.chooseFile");
      this.xlsfile = e.dataTransfer.files[0];
      this.parse();
    },
    saveErrors() {
      var blob = new Blob([this.listedErrors.join("\r\n")], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, this.$t("importer.errorFileName") + ".txt");
    },
    fileInputChange(val) {
      if (!val || val.length < 1) {
        return;
      }
      this.reset(true);
      return this.parse();
    },
    validateCol(col, rowIndex, index) {
      //console.log("validateCol");
      if (!this.columns[index]) {
        //   console.log('undef');
        return null;
      }
      var r = parseInt(rowIndex) + 1;
      // var c = parseInt(index) + 1;
      var c =
        (this.columns[parseInt(index)] &&
          this.columns[parseInt(index)].label) ||
        parseInt(index) + 1;

      var colIsNull = col === "" || col === "NULL";

      var colDef = this.columns[index];
      if (colDef.required && colIsNull) {
        //    console.log('required');
        this.errorCount++;
        this.listedErrors.push(`${r} - ${c}: ${this.messageRequired}`);
        return this.messageRequired;
      }
      if (col && !colIsNull) {
        switch (colDef["format"]) {
          case "date":
          case "datetime":
            if (!this.utils.checkDate(col)) {
              this.errorCount++;
              this.listedErrors.push(`${r} - ${c}: ${this.messageNotDate}`);
              return this.messageNotDate;
            }
            break;
          case "float":
            if (isNaN(parseFloat(col))) {
              this.errorCount++;
              this.listedErrors.push(`${r} - ${c}: ${this.messageNotFloat}`);
              return this.messageNotFloat;
            }
            break;
          case "int":
            if (isNaN(parseInt(col))) {
              this.errorCount++;
              this.listedErrors.push(`${r} - ${c}: ${this.messageNotInt}`);
              return this.messageNotInt;
            }
            break;
        }
      }

      if (!colDef.validation) {
        return null;
      }
      var validationRes = colDef.validation(col);
      // console.log("validationRes:" + validationRes);
      if (validationRes !== null) {
        this.listedErrors.push(`${r} - ${c}: ${validationRes}`);
        this.errorCount++;
      }
      return validationRes;
    },
    formatCol(col, index) {
      if (col === "") {
        return "NULL";
      }
      //console.log("fromat col");
      if (!this.columns[index]) {
        return col;
      }
      var colDef = this.columns[index];
      switch (colDef["format"]) {
        case "date":
          return this.utils.formatDate(col);
        case "datetime":
          return this.utils.formatDateTime(col);
        case "float":
          var v = parseFloat(col);
          if (isNaN(v)) {
            return col;
          }
          return v;
        case "int":
          var vv = parseInt(col);
          if (isNaN(vv)) {
            return col;
          }
          return vv;
        default:
          return col;
      }
    },
    endTimer() {
      window.clearInterval(this.timerInterval);
    },
    beginTimer() {
      this.resetTimer();
      var $dis = this;
      this.timerInterval = window.setInterval(() => $dis.timePassed++, 1000);
    },
    resetTimer() {
      this.endTimer();
      this.timePassed = 0;
    },
    reset(exceptForm) {
      this.filteredItems = {};
      this.filters = {};
      this.done = false;
      this.errorCount = 0;
      this.listedErrors = [];
      this.finalLoading = false;
      this.workbook = null;
      this.parsedJson = null;
      this.parsedJsonStatuses = null;
      this.slicePage = 1;
      this.showOnlyErrorLines = false;
      this.resetTimer();
      !exceptForm && this.$refs && this.$refs.form && this.$refs.form.reset();

      this.skipFirstRows =
        parseInt(localStorage.getItem("importer-skipFirstRows")) || 2;
      this.skipLastRows =
        parseInt(localStorage.getItem("importer-skipLastRows")) || 0;
      this.sliceBy = parseInt(localStorage.getItem("importer-sliceBy")) || 250;
    },
    parse() {
      console.log("parse");
      // console.log(this.$refs.xlsfile);
      // var file = this.$refs.xlsfile.lazyValue;
      console.log(this.xlsfile);
      var file = this.xlsfile;

      if (!file || file.length < 1) {
        return;
      }

      console.log("file external");
      console.log(file);
      this.slicePage = 1;
      this.loading = true;
      this.beginTimer();
      this.$worker
        .run(
          (
            file,
            sheetsToParse,
            url,
            maxcollen,
            skipfirstrows,
            skiplastrows,
            fileReaderCaption
          ) => {
            console.log("file internal");
            console.log(self); // eslint-disable-line no-undef
            console.log(JSON.stringify(event)); // eslint-disable-line no-undef
            console.log("url:" + url);
            // var blobUrl = URL.createObjectURL(
            //   new Blob([typedArray.buffer], { type: "text/javascript" })
            // );

            importScripts(url + "/xlsx.full.min.js"); // eslint-disable-line no-undef
            console.log(file);
            //var sheetsToParse = 1; //todo;
            var parsedJson = {};
            var parsingCounter = 0;
            var workbook;

            const reader = new FileReaderSync(); // eslint-disable-line no-undef

            var result = reader.readAsArrayBuffer(file);

            console.log("read onload");
            var binary = "";

            var bytes = new Uint8Array(result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }

            console.log("read success");
            // eslint-disable-next-line no-undef
            workbook = XLSX.read(binary, {
              type: "binary",
              cellDates: true,
              cellStyles: true
            });
            console.log("workbook success");
            console.log(workbook);

            workbook.SheetNames.forEach(function(name) {
              if (sheetsToParse == 0 || parsingCounter++ < sheetsToParse) {
                console.log("parsing");
                // eslint-disable-next-line no-undef
                parsedJson[name] = XLSX.utils.sheet_to_json(
                  workbook.Sheets[name],
                  {
                    header: 1,
                    defval: "NULL",
                    raw: true
                  }
                );
              }
            });

            var outputJson = {};
            var c = 0;
            var newRowIndex = 0;

            skipfirstrows = parseInt(skipfirstrows);
            skiplastrows = parseInt(skiplastrows);
            console.log(
              `skip first: ${skipfirstrows}, skip last: ${skiplastrows}, max-col-len: ${maxcollen}`
            );

            for (var sh in parsedJson) {
              outputJson[sh] = [];
              var rows = parsedJson[sh];
              for (var rowindex in rows) {
                if (rowindex < skipfirstrows) {
                  console.log(`skip first: rowindex: ${rowindex}`);
                  continue;
                }
                if (parseInt(rowindex) + skiplastrows >= rows.length) {
                  console.log(
                    `skip last: rowindex: ${rowindex}, skiplastrows: ${skiplastrows}, total: ${skiplastrows +
                      parseInt(rowindex)}, rows.length: ${rows.length}`
                  );
                  continue;
                }
                outputJson[sh][newRowIndex] = [];
                c = 0;
                var cols = rows[rowindex];
                for (var colindex in cols) {
                  var col = cols[colindex];
                  if (c++ < maxcollen) {
                    outputJson[sh][newRowIndex].push(col);
                  } else {
                    console.log(`skip horizontal: colindex: ${c}`);
                  }
                }
                newRowIndex++;
              }
            }

            // console.log(parsedJson);
            //console.log(outputJson);
            if (!workbook.Props) {
              workbook.Props = {};
            }
            if (!workbook.Props.Application) {
              var ext = fileReaderCaption;
              if (file.name.indexOf(".") > -1) {
                var temp = file.name.split(".");
                ext =
                  (temp[temp.length - 1] + "").toUpperCase() +
                  " " +
                  fileReaderCaption;
              }
              workbook.Props.Application = ext;
            }
            if (!workbook.Props.AppVersion) {
              workbook.Props.AppVersion = "1.0.0";
            }

            return {
              parsedRaw: parsedJson,
              parsed: outputJson,
              workbook: workbook
            };
          },
          [
            file,
            this.sheetsToParse,
            window.location.origin,
            this.columns.length,
            this.skipFirstRows,
            this.skipLastRows,
            this.$t("importer.fileReader")
          ]
        )
        .then(result => {
          this.parsedJson = result.parsed;
          this.workbook = result.workbook;
          this.parsedJsonStatuses = [];
          var maxColSize = 0;
          for (var raw_i in result.parsedRaw) {
            var raw_ii = result.parsedRaw[raw_i];
            for (var raw_j in raw_ii) {
              var raw_jj = raw_ii[raw_j];
              if (raw_jj.length > maxColSize) {
                maxColSize = raw_jj.length;
              }
            }
          }

          for (var i in this.parsedJson) {
            var ii = this.parsedJson[i];
            this.parsedJsonStatuses[i] = [];
            for (var j in ii) {
              var jj = ii[j];
              this.parsedJsonStatuses[i][j] = [];
              for (var k in jj) {
                var kk = jj[k];
                this.parsedJsonStatuses[i][j][k] = this.validateCol(kk, j, k);
              }
              if (this.rowValidation) {
                let rovV = this.rowValidation(jj, j, this);
                this.parsedJsonStatuses[i][j][jj.length] = rovV;

                if (rovV) {
                  this.errorCount++;
                  this.listedErrors.push(`${parseInt(j) + 1}: ${rovV}`);
                }
              }
            }
          }
          this.endTimer();
          if (this.columns.length > maxColSize) {
            this.errorCount++;
            this.listedErrors.push(this.$t("importer.fileColSizeDoesNotMatch"));
            this.$dialog.error({
              text: this.$t("importer.fileColSizeIsSmallerThenNeeded", {
                need: this.columns.length,
                loaded: maxColSize
              })
            });
          }
          if (this.columns.length < maxColSize) {
            //TODO: too much recursion
            this.$dialog
              .confirm({
                text: this.$t("importer.fileColSizeIsBiggerThenNeeded", {
                  need: this.columns.length,
                  loaded: maxColSize
                })
              })
              .then(t => {
                if (!t) {
                  return this.reset();
                }
              });
          }
          //console.log(this.parsedJsonStatuses);
        })
        .catch(e => {
          console.log("cought error");
          // console.log(e);
          this.listedErrors.push(
            this.$t("errors.unExpectedError") + ": " + e.message
          );
          this.$dialog.error({
            text: this.$t("errors.unExpectedError") + ": " + e.message
          });
          console.error(e);
        })
        .then(() => {
          this.loading = false;
        });
    },
    async importData() {
      try {
        console.log("importData");
        this.finalLoading = true;
        this.loading = true;

        var data = [];
        var sn = this.workbook.SheetNames[0];
        var rows = this.parsedJson[sn];

        for (var rowindex in rows) {
          //console.log(`rowindex: ${rowindex} in ${rows.length}`);
          var row = rows[rowindex];
          // console.log(row);
          // // if (!row) {
          // //   continue;
          // // }
          var rowData = {};
          for (var colindex in this.columns) {
            var col = this.columns[colindex];
            var source = col.source || "column_" + colindex;
            var format = col.format;
            var value = row[colindex];

            //console.log(`format is ${format}`)
            switch (format) {
              case "date":
                value = this.utils.formatDateSql(value);
                break;
              case "datetime":
                value = this.utils.formatDateTimeSQL(value);
                break;
              case "int":
                value = parseInt(value);
                break;
              case "float":
                value = parseFloat(value);
                break;
            }

            rowData[source] = value;
          }
          data.push(rowData);
        }

        var options = {
          module: this.module,
          url: window.location.href,
          secsToParse: this.timePassed,
          application: this.workbook.Props.Application,
          applicationVersion: this.workbook.Props.AppVersion,
          lastChange: this.utils.formatDateTimeSQL(
            this.workbook.Props.ModifiedDate
          ),
          skippedFirst: this.skipFirstRows,
          skippedLast: this.skipLastRows,
          sourceFileName: this.xlsfile.name,
          sourceFileSize: this.xlsfile.size,
          sourceFileType: this.xlsfile.type,
          sourceFileLastModified: this.utils.formatDateTimeSQL(
            this.xlsfile.lastModified
          ),
          total: data.length,
          sheet: sn,
          data: data
        };

        const response = await this.axios.post(this.endpoint, options);

        this.finalLoading = false;
        this.loading = false;
        this.reset(true);
        this.done = true;
        this.anyDataImported = true;
      } catch (error) {
        this.loading = false;
        this.finalLoading = false;
        this.$dialog.error({ text: error.response.data.message });
      }
    },
    show() {
      this.visible = true;
      this.reset();
      this.anyDataImported = false;
    },
    hide() {
      if (!this.workbook || this.anyDataImported) {
        this.reset();
        this.visible = false;
        this.anyDataImported && this.refreshHook && this.refreshHook();
        return;
      }
      this.$dialog
        .confirm({ text: this.$t("importer.areYouSureThereIsWorkbook") })
        .then(t => {
          if (!t) {
            return;
          }
          this.reset();
          this.visible = false;
          this.anyDataImported && this.refreshHook && this.refreshHook();
        });
    }
  },
  created() {},
  mounted() {
    this.columnSourceColumnOrderMap = {};
    for (let i in this.columns) {
      var col = this.columns[i];
      this.columnSourceColumnOrderMap[col.source] = i;
    }
  }
};
</script>


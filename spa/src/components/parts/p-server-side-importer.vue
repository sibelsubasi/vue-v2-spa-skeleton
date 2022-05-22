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
.row-error::before {
  content: "✗";
  font-weight: bold;
  color: #c00;
  border-radius: 5px;
  padding: 4px;
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
          <v-toolbar-title>{{caption || $t('importer.importTitle')}} (Server Side)</v-toolbar-title>
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
            <v-col cols="12" sm="8">
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
            <v-col cols="12" sm="4">
              <v-row>
                <v-col
                  offset="1"
                  offset-sm="0"
                  cols="5"
                  sm="6"
                  style="padding-top:11px; padding-bottom:0"
                >
                  <p-spinner
                    :min="0"
                    :max="99"
                    :step="1"
                    v-model="skipFirstRows"
                    :disabled="loading || !!workbook"
                    :label="$t('importer.skipFromTop')"
                  />
                </v-col>
                <v-col offset="0" cols="5" sm="6" style="padding-top:11px; padding-bottom:0">
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
              <v-progress-linear
                :indeterminate="uploadValue == 0 || uploadValue == 100"
                color="deep-purple accent-4"
                :value="uploadValue == 100 ? 0 : uploadValue"
                rounded
                height="16"
              >
                <template>
                  <small
                    v-if="uploadValue < 100 && uploadValue != 0"
                  >{{$t('importer.uploading')}}: %{{ Math.round(uploadValue,2) }}</small>
                  <small v-else>{{$t('importer.processing')}}...</small>
                </template>
              </v-progress-linear>
              <div
                v-if="uploadValue < 100 && uploadValue != 0"
                style="margin-top:0px;right:35px;font-size:80%;line-height: 1;text-align:right"
              >
                <span style="display:block">
                  <v-icon small>shutter_speed</v-icon>
                  {{uploadCurrentSize}} / {{uploadTotalSize}}
                </span>
                {{uploadCurrentSpeed}}
              </div>
            </v-col>
          </v-row>
          <!-- PARSING LISTING -->
          <v-row align="start">
            <v-col cols="1" v-if="workbook || done" style="max-width:35px">
              <v-icon>fa fa-file-excel-o</v-icon>
            </v-col>
            <v-col cols="11" sm="5" v-if="workbook">
              <span style="display:block">{{workbook.properties.reader}}</span>

              <small>{{$t('importer.parseDetail',{page: workbook.properties.sheetCount, sheet: workbook.properties.sheet,length: workbook.data.total })}}</small>
              <small style="display:block">
                {{$t('importer.lastChange')}} {{utils.formatDateTime(workbook.properties.modified)}}
                <span
                  v-show="workbook.properties.creator"
                >, {{$t('importer.byWhom',{who: workbook.properties.creator})}}</span>
                <span style="display:block">
                  {{$t('importer.tookSeconds',{seconds: workbook.benchmarks.total})}}
                  <br />
                  (
                  {{$t('importer.bmParsed')}}: {{workbook.benchmarks.parsed}},
                  {{$t('importer.bmTrimmed')}}: {{workbook.benchmarks.trimmed}},
                  {{$t('importer.bmtValidated')}}: {{workbook.benchmarks.validated}},
                  {{$t('importer.bmSaved')}}: {{workbook.benchmarks.saved}}
                  )
                </span>
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
                      v-if="workbook && !done"
                      text
                      style="margin:20px 0"
                    >
                      <v-icon>cloud_download</v-icon>
                      {{ $t('importer.downloadUnshownErrors')}}
                    </v-btn>
                  </small>
                  <small v-else>
                    {{$t('importer.nRowsRead',{count: workbook.data.total})}}
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
          <v-divider v-if="workbook" />
          <v-row v-if="workbook">
            <v-col cols="9">
              <p-search-combobox
                ref="searchCombobox"
                :label="$t('actions.search')"
                :columns="columns"
                v-model="multisearch"
              />
              <v-text-field
                v-if="false"
                v-model="parsedSearch"
                append-icon="search"
                :label="$t('actions.search')"
                single-line
                hide-details
                class="mb-5 ml-3"
              ></v-text-field>
            </v-col>
            <v-spacer />
            <v-col cols="auto">
              <v-checkbox
                v-model="parsedOptions.filters.validations"
                :label="$t('importer.showOnlyErorrLines')"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-data-table
            v-if="workbook"
            class="elevation-0 ma-2 mt-0"
            :headers="parsedHeaders"
            :items="parsedData"
            :options.sync="parsedOptions"
            :server-items-length="parsedTotalDataCount"
            :search="parsedSearch"
            :loading="dgLoading"
            :footer-props="parsedFooterOptions"
            :items-per-page="parsedItemsPerPage"
            calculate-widths
          >
            <template v-for="header in parsedHeaders" v-slot:[concatItem(header.value)]="{ item }">
              <v-tooltip bottom :key="header.value" v-if="header.callable(item)">
                <template v-slot:activator="{ on }">
                  <p
                    :class="header.format ? header.format(item) : ''"
                    class="mb-0"
                    v-on="on"
                  >{{ item[header.value] }}</p>
                </template>
                <span>{{header.callable(item)}}</span>
              </v-tooltip>
              <p
                v-else
                :class="header.format ? header.format(item) : ''"
                class="mb-0"
                :key="header.value"
              >{{ item[header.value] }}</p>
            </template>
          </v-data-table>
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
const _ = require("lodash");

import Vue from "vue";
import moment from "moment";

import pImporterHelp from "./parts/p-importer-help";

import saveAs from "file-saver";
import XLSX_MAIN from "xlsx";

import endPointSelector from "@/plugins/endpoint-selector";

export default {
  name: "p-server-side-importer",
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
      required: true,
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
    refreshHook: {
      type: Function,
      required: false,
      default: null
    },
    rows: {
      required: false,
      default: null
    }
  },
  data: vm => ({
    multisearch: [],
    parsedData: [],
    parsedOptions: {
      filters: {
        search: "",
        validations: false
      }
    },
    exParsedOptions: null,
    parsedTotalDataCount: 0,
    parsedSearch: "",
    parsedFooterOptions: {
      "items-per-page-options": [10, 25, 50, 100, 250],
      "show-current-page": true,
      "show-first-last-page": true
    },
    parsedItemsPerPage: parseInt(
      localStorage.getItem("importer-itemsPerpage") || 25
    ),
    xlsfile: null,
    visible: false,
    loading: false,
    dgLoading: false,
    finalLoading: false,
    workbook: null,
    listedErrors: {},
    done: false,
    skipFirstRows: 0,
    skipLastRows: 0,
    help: false,
    anyDataImported: false,
    uploadProgressEvent: null,
    exUploadProgressEvent: null,
    fileInputLabel: vm.$t("importer.chooseFile"),
    messageRequired: vm.$t("importer.required"),
    messageNotFloat: vm.$t("importer.notFloat"),
    messageNotInt: vm.$t("importer.notInt"),
    messageNotDate: vm.$t("importer.notDate")
  }),
  computed: {
    uploadCurrentSpeed() {
      if (!this.uploadProgressEvent || !this.exUploadProgressEvent) {
        return "? KB/sec";
      }

      var dt =
        (this.uploadProgressEvent.timeStamp -
          this.exUploadProgressEvent.timeStamp) /
        1000;
      var dl =
        this.uploadProgressEvent.loaded - this.exUploadProgressEvent.loaded;
      const maxSpeed = 104857600;
      var speed = maxSpeed;

      if (dt > 0) {
        speed = dl / dt;
      }
      if (speed > maxSpeed) {
        speed = maxSpeed;
      }
      console.log(`deltaT: ${dt}, deltaL: ${dl}, speed: ${speed}`);

      if (speed < 1024) {
        return speed.toFixed(2) + " Bytes/sec";
      } else if (speed > 1024 && speed < 1048576) {
        return (speed / 1024).toFixed(2) + " KB/sec";
      }
      return (speed / 1048576).toFixed(2) + " MB/sec";
    },
    uploadCurrentSize() {
      if (!this.uploadProgressEvent) {
        return "?";
      }
      var size = this.uploadProgressEvent.loaded / 1024;
      if (size < 1024) {
        return size.toFixed(2) + " KB";
      }
      return (size / 1024).toFixed(2) + " MB";
    },
    uploadTotalSize() {
      if (!this.uploadProgressEvent) {
        return "?";
      }
      var size = this.uploadProgressEvent.total / 1024;
      if (size < 1024) {
        return size.toFixed(2) + " KB";
      }
      return (size / 1024).toFixed(2) + " MB";
    },
    uploadValue: {
      get() {
        if (!this.uploadProgressEvent) {
          return 0;
        }
        return (
          (this.uploadProgressEvent.loaded * 100) /
          this.uploadProgressEvent.total
        );
      },
      set(value) {}
    },
    headersForFilters() {
      var ret = [];
      for (let i in this.columns) {
        let c = this.columns[i];
        ret.push(c.label + ": ");
      }
      return ret;
    },
    parsedHeaders() {
      var ret = [];
      for (let i in this.columns) {
        let c = this.columns[i];
        ret.push({
          text: c.label,
          value: c.source,
          format: item => {
            if (item.validations && item.validations[i]) {
              return "red--text";
            }
            if (item.validations && item.validations["*"] && i == 0) {
              return "row-error";
            }
          },
          callable: item => {
            if (item.validations && item.validations[i]) {
              return item.validations[i];
            }
            if (item.validations && item.validations["*"] && i == 0) {
              return item.validations["*"];
            }
          }
        });
      }
      console.log("parsedHeaders");
      console.log(ret);
      return ret;
    },
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
    errorCount() {
      return this.workbook && this.workbook.data && this.workbook.data.error;
    },
    readyToImport() {
      return this.errorCount == 0;
    },
    computedListedErrors() {
      return this.getErrorsAsArray(3);
    }
  },
  watch: {
    multisearch: {
      handler() {
        if (!this.$refs.searchCombobox.canStartSearch()) {
          return;
        }
        console.log(`multisearch`);
        this.parsedOptions.filters = this.$refs.searchCombobox.asSourceMapping();
        this.debouncedSetRequestOptions();
      },
      deep: true
    },
    parsedOptions: {
      handler() {
        this.debouncedSetRequestOptions();
      },
      deep: true
    },
    parsedSearch() {
      this.debouncedSetSearch();
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
    }
  },
  methods: {
    concatItem(s) {
      return "item." + s;
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
    getErrorsAsArray(breaak = 2) {
      var ret = [];
      var c = 0;
      for (let i in this.listedErrors) {
        var rk = parseInt(i) + 1;
        var s = [rk + ": "];
        for (let j in this.listedErrors[i]) {
          var ck = j == "*" ? "*" : parseInt(j) + 1;
          s.push(ck + ": " + this.listedErrors[i][j]);
        }
        ret.push(s.join("\r\n\t"));
        if (breaak && ++c > breaak) {
          break;
        }
      }
      return ret;
    },
    saveErrors() {
      var blob = new Blob([this.getErrorsAsArray(null).join("\r\n\r\n")], {
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
    reset(exceptForm) {
      this.done = false;
      this.listedErrors = {};
      this.finalLoading = false;
      this.workbook = null;
      this.parsedJson = null;
      this.parsedJsonStatuses = null;
      this.slicePage = 1;
      this.uploadProgressEvent = null;
      this.exUploadProgressEvent = null;
      this.parsedOptions = {
        filters: {
          search: "",
          validations: false
        }
      };

      !exceptForm && this.$refs && this.$refs.form && this.$refs.form.reset();

      this.skipFirstRows =
        parseInt(localStorage.getItem("importer-skipFirstRows")) || 2;
      this.skipLastRows =
        parseInt(localStorage.getItem("importer-skipLastRows")) || 0;
    },
    getPostOptions(formData = null) {
      var data = {
        module: this.module,
        url: window.location.href,
        columns: JSON.stringify(this.columns),
        rows: JSON.stringify(this.rows),
        skipFirst: this.skipFirstRows,
        skipLast: this.skipLastRows,
        sourceFileName: this.xlsfile.name,
        sourceFileSize: this.xlsfile.size,
        sourceFileType: this.xlsfile.type,
        sourceFileLastModified: this.utils.formatDateTimeSQL(
          this.xlsfile.lastModified
        )
      };
      if (formData) {
        for (let i in data) {
          formData.append(i, data[i]);
        }
      }
      return data;
    },
    async fetchData() {
      if (!this.workbook) {
        return;
      }
      this.dgLoading = true;
      try {
        //var url = `excel/list/${this.workbook.ids.key}`;
        var url = `https://${endPointSelector(false)}.${process.env.VUE_APP_BASEURL}/inapi/excel/list/${this.workbook.ids.key}`;

        var response = await this.axios.post(url, this.parsedOptions);

        this.parsedData = response.data.data;
        this.parsedTotalDataCount = response.data.total;
      } catch (error) {
        this.$dialog.error({ text: error.response.data.message });
      } finally {
        this.dgLoading = false;
      }
    },
    async parse() {
      const formData = new FormData();
      formData.append("xlsfile", this.xlsfile);
      this.getPostOptions(formData);

      this.loading = true;
      try {
        this.uploadProgressEvent = null;
        this.exUploadProgressEvent = null;
        //var response = await this.axios.post("excel/parse", formData, {
        var response = await this.axios.post(`https://${endPointSelector(false)}.${process.env.VUE_APP_BASEURL}/inapi/excel/parse`, formData, {
          headers: {
            "content-type": `multipart/form-data; boundary=${formData._boundary}`
          },
          onUploadProgress: progressEvent => {
            var pe = {};
            pe.loaded = progressEvent.loaded;
            pe.total = progressEvent.total;
            pe.timeStamp = new Date().getTime();

            console.log(pe);
            if (this.uploadProgressEvent) {
              this.exUploadProgressEvent = JSON.parse(
                JSON.stringify(this.uploadProgressEvent)
              );
            }
            this.uploadProgressEvent = pe;
          }
        });
        this.workbook = response.data;
        this.listedErrors = this.workbook.data.listedErrors;
        return this.fetchData();
      } catch (error) {
        this.$dialog.error({ text: error.response.data.message });
      } finally {
        this.loading = false;
      }
    },
    async importData() {
      try {
        console.log("importData");
        this.finalLoading = true;
        this.loading = true;

        const fetchResponse = await this.axios.get(
          // `excel/all/${this.workbook.ids.key}`
          `https://${endPointSelector(false)}.${process.env.VUE_APP_BASEURL}/inapi/excel/all/${this.workbook.ids.key}`
        );

        var data = fetchResponse.data.data;

        var options = {
          module: this.module,
          url: window.location.href,
          application: "Microsoft Office",
          applicationVersion: "1.0.0",
          lastChange: this.utils.formatDateTimeSQL(
            this.workbook.properties.modified
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
          sheet: this.workbook.properties.sheet,
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
  created() {
    this.debouncedSetSearch = _.debounce(() => {
      this.parsedOptions.filters.search = this.parsedSearch;
      this.parsedOptions.page = 1; //always start from begining
    }, 1000);

    this.debouncedSetRequestOptions = _.debounce(() => {
      let co = JSON.stringify(this.parsedOptions);
      let eo = JSON.stringify(this.exParsedOptions);
      if (co != eo) {
        this.fetchData();
      }
      this.exParsedOptions = JSON.parse(JSON.stringify(this.parsedOptions)); //copy
      localStorage.setItem(
        "importer-itemsPerpage",
        this.parsedOptions.itemsPerPage
      );
    }, 100);
  },
  mounted() {
    this.parsedOptions = {
      filters: {
        search: "",
        validations: false
      }
    };
  }
};
</script>


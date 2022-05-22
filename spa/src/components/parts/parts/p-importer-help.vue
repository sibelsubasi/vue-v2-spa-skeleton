<template>
  <v-dialog v-model="show" scrollable max-width="1103px">
    <v-card tile flat>
      <v-card-title primary-title class="headline pa-0">
        <v-toolbar flat color="grey lighten-1">
          <v-toolbar-title>{{$t('importer.about')}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp">
            <v-btn icon @click="show = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-container>
          <h3>{{$t('importer.supportedFormats')}}</h3>
          <p>{{$t('importer.supportedFormatsListed')}}</p>
          <v-row>
            <v-col>
              <strong>{{$t('importer.excelWorksheetFormats')}}</strong>
              <ul class="text-small">
                <li>Excel 2007+ XML Formats (XLSX/XLSM)</li>
                <li>Excel 2007+ Binary Format (XLSB BIFF12)</li>
                <li>Excel 2003-2004 XML Format (XML "SpreadsheetML")</li>
                <li>Excel 97-2004 (XLS BIFF8)</li>
                <li>Excel 5.0/95 (XLS BIFF5)</li>
                <li>Excel 4.0 (XLS/XLW BIFF4)</li>
                <li>Excel 3.0 (XLS BIFF3)</li>
                <li>Excel 2.0/2.1 (XLS BIFF2)</li>
              </ul>
            </v-col>
            <v-col>
              <strong>{{$t('importer.excelSupportedTextFormats')}}</strong>
              <ul class="text-small">
                <li>Delimiter-Separated Values (CSV/TXT)</li>
                <li>Data Interchange Format (DIF)</li>
                <li>Symbolic Link (SYLK/SLK)</li>
                <li>Lotus Formatted Text (PRN)</li>
                <li>UTF-16 Unicode Text (TXT)</li>
                <li>HTML Tables</li>
                <li>Rich Text Format tables (RTF)</li>
                <li>Ethercalc Record Format (ETH)</li>
              </ul>
            </v-col>
            <v-col>
              <strong>{{$t('importer.otherWorksheetFormats')}}</strong>
              <ul class="text-small">
                <li>OpenDocument Spreadsheet (ODS)</li>
                <li>Flat XML ODF Spreadsheet (FODS)</li>
                <li>Uniform Office Format Spreadsheet (标文通 UOS1/UOS2)</li>
                <li>dBASE II/III/IV / Visual FoxPro (DBF)</li>
                <li>Lotus 1-2-3 (WKS/WK1/WK2/WK3/WK4/123)</li>
                <li>Quattro Pro Spreadsheet (WQ1/WQ2/WB1/WB2/WB3/QPW)</li>
              </ul>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h3>{{$t('importer.limits')}}</h3>
              <p>
                {{$t('importer.teoricalLimit')}}.
                <br />
                {{$t('importer.practicalLimit')}}.
              </p>
              <p>{{$t('importer.simpleFormatsAreFaster')}}</p>
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>{{$t('importer.format')}}</th>
                      <th>{{$t('importer.maxCols')}}</th>
                      <th>{{$t('importer.maxRows')}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Excel 2007+ XML Formats (XLSX/XLSM)</td>
                      <td>16384</td>
                      <td>1048576</td>
                    </tr>
                    <tr>
                      <td>Excel 2007+ Binary Format (XLSB BIFF12)</td>
                      <td>16384</td>
                      <td>1048576</td>
                    </tr>
                    <tr>
                      <td>Excel 97-2004 (XLS BIFF8)</td>
                      <td>256</td>
                      <td>65536</td>
                    </tr>
                    <tr>
                      <td>Excel 5.0/95 (XLS BIFF5)</td>
                      <td>256</td>
                      <td>16384</td>
                    </tr>
                    <tr>
                      <td>Excel 2.0/2.1 (XLS BIFF2)</td>
                      <td>256</td>
                      <td>16384</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <p>&nbsp;</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "p-importer-help",
  components: {},
  data: vm => ({}),
  props: {
    value: Boolean
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  watch: {},
  mounted() {},
  created() {}
};
</script>
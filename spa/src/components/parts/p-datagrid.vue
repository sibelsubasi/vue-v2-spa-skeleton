<style>
.yet-another-data-table table {
  /* table-layout: fixed; */
  /* white-space: normal; */
  white-space: nowrap;
}
.v-application--is-ltr .v-list-item__action:first-child {
  margin-right: 16px !important;
}
/* table th + th { border-left:1px solid #dddddd; }
table td + td { border-left:1px solid #dddddd; } */
.v-data-table-header th,
.dg-toolbar {
  background-color: #f7f7f7;
}
.v-data-table-header th span {
  font-size: 13px;
}
.bg-color-white {
  background-color: #fff;
}
.nomarker
  .v-tabs
  .v-tabs-bar
  .v-slide-group__wrapper
  .v-slide-group__content
  .v-tabs-slider-wrapper {
  height: 0 !important;
}

/*
not working properly
.side-info-bar-open .dg-grid-container {margin-right:500px;}
*/
</style>

<template>
  <div class="dg-grid-container">
    <v-card
      :elevation="thin ? 0 : 2"
      v-bind:class="{
        nomarker: !thin && searchable && !allowQuickSearch,
      }"
    >
      <v-tabs v-if="!thin" v-model="tabsModel">
        <v-toolbar flat>
          <v-icon class="ml-2">{{ icon }}</v-icon>
          <v-toolbar-title class="ml-2">{{
            caption || $t("dataTable.list")
          }}</v-toolbar-title>
        </v-toolbar>
        <v-tooltip
          bottom
          v-if="
            !thin &&
            filters &&
            filters.length > 0 &&
            searchable &&
            allowQuickSearch
          "
        >
          <template v-slot:activator="{ on }">
            <v-tab v-on="on">
              <v-icon left dense>search</v-icon>
            </v-tab>
          </template>
          <span>{{ $t("dataTable.quickSearch") }}</span>
        </v-tooltip>
        <v-tooltip
          bottom
          v-if="filters && filters.length > 0 && searchable && allowQuickSearch"
        >
          <template v-slot:activator="{ on }">
            <v-tab v-on="on">
              <v-icon left dense>filter_list</v-icon>
            </v-tab>
          </template>
          <span>{{ $t("dataTable.detailedSearch") }}</span>
        </v-tooltip>
        <v-tab
          v-if="!thin && searchable && !allowQuickSearch"
          style="visibilty: hidden; width: 1px; height: 1px"
        ></v-tab>

        <v-tab-item v-if="searchable && allowQuickSearch">
          <v-card flat>
            <v-card-text>
              <v-layout row wrap>
                <v-flex md8 class="pl-5">
                  <p-search-combobox
                    ref="searchCombobox"
                    :allowSearchAll="false"
                    :label="$t('dataTable.quickSearch')"
                    itemValue="name"
                    :columns="filters"
                    v-model="filtersQuickModel"
                  />
                  <!-- <v-text-field
                    v-model="search"
                    append-icon="search"
                    :label="$t('actions.search')"
                    single-line
                    hide-details
                    class="mb-5 ml-3"
                  ></v-text-field> -->
                </v-flex>
                <!-- 
                <v-flex style="padding-top: 20px; padding-left: 10px">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon large v-on="on">
                        <v-icon>save</v-icon>
                      </v-btn>
                    </template>
                    Aramayı Kaydet
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon large v-on="on" style="margin-left: 10px">
                        <v-icon>saved_search</v-icon>
                      </v-btn>
                    </template>
                    Kayıtlı Aramalar
                  </v-tooltip>
                </v-flex>-->
              </v-layout>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item v-if="!thin && filters && filters.length > 0 && searchable">
          <v-card flat>
            <v-card-text>
              <v-layout row wrap>
                <v-flex v-for="filter in filters" v-bind:key="filter.name">
                  <!--   
                  xl2
                  lg2
                  md3
                  sm6
                  xs12
                  -->
                  <div class="pl-4 mb-4">
                    <v-text-field
                      v-if="filter.type == 'text'"
                      v-model="filter.model"
                      :label="filter.label"
                      counter
                      :maxlength="filter.maxlength"
                      :hide-details="!filter.maxlength"
                      :rules="filter.rules ? filter.rules : []"
                      v-mask="filter.mask ? filter.mask : ''"
                      eager
                    ></v-text-field>
                    <v-container
                      v-else-if="filter.type == 'select'"
                      style="padding: 0"
                    >
                      <v-select
                        :items="filter.lookups"
                        :label="filter.label"
                        :multiple="filter.multiple"
                        v-model="filter.model"
                        clearable
                      >
                        <template
                          v-if="filter.multiple"
                          v-slot:selection="{ item, index }"
                        >
                          <v-chip
                            x-small
                            v-if="index === 0"
                            style="height: 24px"
                          >
                            <span>{{ item.text }}</span>
                          </v-chip>
                          <span v-if="index === 1" class="grey--text caption"
                            >(+{{ filter.model.length - 1 }}
                            {{ $t("actions.more") }})</span
                          >
                        </template>
                      </v-select>
                    </v-container>
                    <v-container
                      v-else-if="filter.type == 'lookup'"
                      style="padding: 0"
                    >
                      <p-lookup
                        :id="filter.id"
                        :fetch="filter.fetch"
                        :fetchOptions="filter.fetchOptions"
                        :responseManipulator="filter.responseManipulator"
                        :responseData="filter.responseData"
                        :depends="filter.depends"
                        :label="filter.label"
                        :multiple="filter.multiple"
                        v-model="filter.model"
                        clearable
                      >
                        <template
                          v-if="filter.multiple"
                          v-slot:selection="{ item, index }"
                        >
                          <v-chip v-if="index === 0" style="height: 24px">
                            <span>{{ item.text }}</span>
                          </v-chip>
                          <span v-if="index === 1" class="grey--text caption"
                            >(+{{ filter.model.length - 1 }}
                            {{ $t("actions.more") }})</span
                          >
                        </template>
                      </p-lookup>
                    </v-container>
                    <v-menu
                      v-else-if="filter.type == 'date'"
                      v-model="filter.visibility"
                      :ref="filter.name"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="filter.model"
                          :label="filter.label"
                          prepend-inner-icon="event"
                          v-on="on"
                          readonly
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :max="getMinMax(filter.max)"
                        :min="getMinMax(filter.min)"
                        v-model="filter.model"
                        no-title
                        @input="filter.visibility = false"
                        first-day-of-week="1"
                        :weekday-format="weekdayFormat"
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            filter.visibility = false;
                            filter.model = '';
                          "
                          >{{ $t("actions.clear") }}</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                    <v-datetime-picker
                      v-else-if="filter.type == 'datetime'"
                      v-model="filter.model"
                      :label="filter.label"
                      @input="filter.visibility = false"
                      :dialogWidth="350"
                      :timePickerProps="{ format: '24hr' }"
                      :clearText="$t('actions.clear')"
                      :okText="$t('actions.ok')"
                      :datePickerProps="{
                        'first-day-of-week': '1',
                        'weekday-format': weekdayFormat,
                      }"
                    >
                    </v-datetime-picker>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
    <v-card :elevation="thin ? 0 : 2" class="rounded-0">
      <v-overlay absolute :value="loading" opacity="0.10">
        <v-progress-circular
          indeterminate
          color="deep-purple accent-4"
          size="64"
        ></v-progress-circular>
      </v-overlay>
      <v-data-table
        class="elevation-0 yet-another-data-table ma-2 mt-0"
        :key="columnSortKey"
        :headers="computedHeadersWithVisiblityFilter"
        :items="data"
        :options.sync="options"
        :server-items-length="totalDataCount"
        :search="search"
        :loading="loading"
        :item-key="uniqueColumn"
        :show-select="uniqueColumn && selectable"
        :single-select="singleSelect"
        :footer-props="footerOptions"
        :items-per-page="itemsPerPage"
        :hide-default-footer="thin || !paginatable"
        v-model="selected"
        calculate-widths
        v-sortable-table="{ onEnd: updateHeaderOrder }"
      >
        <!-- hide-default-header -->
        <template v-slot:top>
          <v-row justify="start" class="ma-0 dg-toolbar">
            <v-menu
              offset-y
              max-width="240"
              v-if="
                !thin && massActions && massActions.length > 0 && selectable
              "
            >
              <template #activator="{ on: onMenu }">
                <v-tooltip bottom>
                  <template #activator="{ on: onTooltip }">
                    <v-btn
                      text
                      small
                      v-on="{ ...onMenu, ...onTooltip }"
                      class="ml-1 mt-1"
                      color="#707070"
                    >
                      <v-icon>more_vert</v-icon> Daha fazlası..
                    </v-btn>
                  </template>
                  <span>{{ $t("dataTable.actions") }}</span>
                </v-tooltip>
              </template>
              <v-list dense>
                <v-list-item
                  v-for="action in massActions"
                  v-bind:key="action.label"
                  @click="executeAfterWarning(action, selected)"
                  :disabled="
                    (action.guard && !action.guard(selected)) ||
                    selected.length < 1
                  "
                >
                  <v-list-item-content dense>
                    <v-list-item-title style="min-width: 200px">
                      <v-icon>{{ action.icon }}</v-icon>
                      {{ action.label }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-divider
              vertical
              class="ml-4 mt-1 mr-4 mb-1"
              v-if="
                !thin && massActions && massActions.length > 0 && selectable
              "
            ></v-divider>

            <v-tooltip bottom v-if="!thin && clearable">
              <template v-slot:activator="{ on }">
                <v-btn icon class="ml-1" v-on="on" @click="clearFilters">
                  <v-icon>filter_alt_off</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("dataTable.clearSearch") }}</span>
            </v-tooltip>
            <v-tooltip bottom v-if="!thin && clearable">
              <template v-slot:activator="{ on }">
                <v-btn icon class="ml-5" v-on="on" @click="clearSorting">
                  <v-icon>sort</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("dataTable.clearSorting") }}</span>
            </v-tooltip>
            <v-divider
              vertical
              class="ml-4 mt-1 mb-1"
              v-if="!thin && clearable"
            ></v-divider>
            <v-tooltip bottom v-if="!thin && clearable">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  class="ml-5"
                  v-on="on"
                  @click="restoreView"
                  :disabled="!computedViewHasChanged"
                >
                  <v-icon>restore_page</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("dataTable.restoreView") }}</span>
            </v-tooltip>

            <v-menu
              v-if="!thin && clearable"
              offset-y
              max-width="800"
              min-width="400"
              :close-on-content-click="false"
            >
              <template #activator="{ on: onMenu }">
                <v-tooltip bottom>
                  <template #activator="{ on: onTooltip }">
                    <v-btn icon v-on="{ ...onMenu, ...onTooltip }" class="ml-5">
                      <v-icon>rule</v-icon>
                      <v-badge
                        v-if="computedHiddenColumnCount > 0"
                        color="red"
                        :content="computedHiddenColumnCount"
                      ></v-badge>
                    </v-btn>
                  </template>
                  <span v-if="computedHiddenColumnCount == 0">{{
                    $t("dataTable.chooseFieldsToShow")
                  }}</span>
                  <span v-else>
                    {{
                      $t("dataTable.chooseFieldsToShowLimited", {
                        count: computedHiddenColumnCount,
                      })
                    }}
                  </span>
                </v-tooltip>
              </template>
              <v-row class="bg-color-white pt-5" style="margin-bottom: 0">
                <p
                  style="position: absolute; top: 10px; left: 20px"
                  class="caption"
                >
                  {{ $t("dataTable.showHideHint") }}
                </p>
                <v-col
                  :cols="
                    12 / Math.ceil(computedHeaders.length / fieldPerColumn)
                  "
                  v-for="colind in Math.ceil(
                    computedHeaders.length / fieldPerColumn
                  )"
                  v-bind:key="'col-sel-' + colind"
                >
                  <v-list dense flat>
                    <v-list-item-group
                      v-model="fieldVisibilites"
                      multiple
                      dense
                    >
                      <v-list-item
                        dense
                        v-for="header in computedHeaders.slice(
                          (colind - 1) * fieldPerColumn,
                          colind * fieldPerColumn
                        )"
                        v-bind:key="header.text + header.value"
                        :value="header.value"
                      >
                        <template v-slot:default="{ active }">
                          <v-list-item-action dense style="margin: 0">
                            <v-checkbox
                              dense
                              :input-value="active"
                              color="primary"
                            ></v-checkbox>
                          </v-list-item-action>
                          <v-list-item-content dense>
                            <v-list-item-title dense style="min-width: 200px">
                              {{ header.text || "#" }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-col>
              </v-row>
            </v-menu>

            <v-menu
              v-if="!thin && clearable"
              offset-y
              max-width="800"
              min-width="400"
              :close-on-content-click="false"
            >
              <template #activator="{ on: onMenu }">
                <v-tooltip bottom>
                  <template #activator="{ on: onTooltip }">
                    <v-btn icon v-on="{ ...onMenu, ...onTooltip }" class="ml-5">
                      <v-icon>wrap_text</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("dataTable.overflowSettings") }}</span>
                </v-tooltip>
              </template>

              <v-row class="bg-color-white pa-3" style="margin-bottom: 0">
                <v-col cols="12">
                  <p
                    style="position: absolute; top: 10px; left: 15px"
                    class="caption"
                  >
                    {{ $t("dataTable.makeOverflowedTextTo") }}:
                  </p>
                  <v-radio-group v-model="wordwrap" row dense>
                    <v-radio
                      dense
                      :label="$t('dataTable.wrap')"
                      value="wrap"
                    ></v-radio>
                    <v-radio
                      dense
                      :label="$t('dataTable.hide')"
                      value="hide"
                    ></v-radio>
                    <v-radio
                      dense
                      :label="$t('dataTable.leaveAsIs')"
                      value="default"
                    ></v-radio>
                  </v-radio-group>
                  <v-card flat v-if="wordwrap == 'wrap' || wordwrap == 'hide'">
                    <v-subheader>{{ $t("dataTable.charLimit") }}</v-subheader>
                    <v-slider
                      v-model="wrapamount"
                      :max="maxWrapAmount"
                      :min="minWrapAmount"
                      append-icon="add"
                      prepend-icon="remove"
                      :thumb-label="peekThumbLabel"
                      @click:append="incWrapAmount(10)"
                      @click:prepend="incWrapAmount(-10)"
                    ></v-slider>
                  </v-card>
                </v-col>
              </v-row>
            </v-menu>
            <v-divider
              vertical
              class="ml-4 mt-1 mb-1"
              v-if="!thin && exportable"
            ></v-divider>

            <v-tooltip bottom v-if="!thin && exportable && !exportLoading">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="exportExcel" class="ml-5">
                  <v-icon>cloud_download</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("dataTable.export") }}</span>
            </v-tooltip>
            <v-btn
              v-else-if="!thin && exportable && exportLoading"
              class="ml-5"
              icon
              disabled
            >
              <v-progress-circular
                size="24"
                indeterminate
              ></v-progress-circular>
            </v-btn>

            <v-spacer />
            <v-tooltip
              bottom
              v-for="(btn, index) in actions"
              :key="btn.label + index"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="btn.action"
                  :color="btn.color || 'primary'"
                  :dark="!!btn.dark"
                  v-on="on"
                  class="mr-3"
                  :small="btn.small"
                  v-bind:style="{
                    right: index * 70 + 'px',
                    marginTop:
                      (btn.fab === false ? (btn.small ? 4 : 0) : -12) + 'px',
                  }"
                  absolute
                  :fab="btn.fab === false ? false : true"
                  v-show="btn.guard && btn.guard()"
                >
                  <v-icon>{{ btn.icon || "add_circle_outline" }}</v-icon>
                  <small
                    style="padding-left: 4px"
                    v-if="btn.fab === false && !$vuetify.breakpoint.xsOnly"
                    >{{ btn.label }}</small
                  >
                </v-btn>
              </template>
              <span>{{ btn.label || $t("dataTable.addNew") }}</span>
            </v-tooltip>
          </v-row>
          <v-divider></v-divider>
        </template>
        <template v-slot:item.action="{ item /* eslint-disable-line */ }">
          <v-btn
            v-for="action in rowActions"
            v-bind:key="action.icon + Math.random()"
            :href="action.href && action.href(item)"
            class="mr-1"
            small
            icon
            :color="action.color || 'gray'"
            :disabled="
              (action.guard && !action.guard(item, action)) ||
              runningRowActions.indexOf(stringifyAction(action, item)) > -1
            "
            @click="action.action && runRowAction(action, item)"
          >
            <v-progress-circular
              v-if="
                runningRowActions.indexOf(stringifyAction(action, item)) > -1
              "
              indeterminate
              size="20"
              width="3"
            ></v-progress-circular>
            <v-tooltip bottom v-else-if="action.hint">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small>{{
                  action.icon || "bug_report"
                }}</v-icon>
              </template>
              <span>{{ action.hint }}</span>
            </v-tooltip>
            <v-icon v-else small>{{ action.icon || "bug_report" }}</v-icon>
          </v-btn>
        </template>

        <!-- EXTRA ROW ACTIONS -->
        <template v-slot:item.extra_action="{ item /* eslint-disable-line */ }">
          <v-layout justify-center>
            <v-btn
              v-for="extra_action in extraRowActions"
              v-bind:key="extra_action.icon + Math.random()"
              :href="extra_action.href && extra_action.href(item)"
              class="m-1 px-0"
              small
              text
              :icon="typeof extra_action.icon == 'string' || false"
              :color="extra_action.color || 'blue'"
              :disabled="
                (extra_action.guard &&
                  !extra_action.guard(item, extra_action)) ||
                runningRowActions.indexOf(stringifyAction(extra_action, item)) >
                  -1
              "
              @click="extra_action.action && runRowAction(extra_action, item)"
            >
              <span v-if="extra_action.text">{{ extra_action.text }}</span>
              <v-progress-circular
                v-if="
                  runningRowActions.indexOf(
                    stringifyAction(extra_action, item)
                  ) > -1
                "
                indeterminate
                size="20"
                width="3"
              ></v-progress-circular>
              <v-tooltip bottom v-else-if="extra_action.hint">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small>{{ extra_action.icon || "" }}</v-icon>
                </template>
                <span>{{ extra_action.hint }}</span>
              </v-tooltip>
              <v-icon v-else small>{{ extra_action.icon || "" }}</v-icon>
            </v-btn>
          </v-layout>
        </template>
        <!-- /EXTRA ROW ACTIONS -->

        <template
          v-for="header in formatedHeaders"
          v-slot:[concatItem(header.value)]="{ item }"
        >
          <template v-if="header.action">
            <v-btn
              v-bind:key="header.action.text + Math.random()"
              :href="header.action.href && action.href(item)"
              class="px-0"
              small
              text
              :color="header.action.color || 'blue'"
              :disabled="
                (header.action.guard &&
                  !header.action.guard(item, header.action)) ||
                runningRowActions.indexOf(
                  stringifyAction(header.action, item)
                ) > -1
              "
              @click="header.action.action && runRowAction(header.action, item)"
            >
              <v-progress-circular
                v-if="
                  runningRowActions.indexOf(
                    stringifyAction(header.action, item)
                  ) > -1
                "
                indeterminate
                size="20"
                width="3"
              ></v-progress-circular>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small v-if="header.action.icon">
                    {{ header.action.icon }}
                  </v-icon>
                  <span
                    v-on="on"
                    :class="header.format ? header.format(item) : ''"
                    class="mb-0 dg-header"
                    :key="header.value"
                  >
                    <span
                      v-for="ln in printDataColumn(item, header)"
                      v-bind:key="ln + item"
                      style="display: block"
                      >{{ ln }}</span
                    >
                  </span>
                </template>
                <span>{{ header.action.hint || header.text }}</span>
              </v-tooltip>
            </v-btn>
          </template>
          <p
            v-else
            :class="header.format ? header.format(item) : ''"
            class="mb-0 dg-header"
            :key="header.value"
            :title="
              header.callable ? header.callable(item) : item[header.value]
            "
          >
            <span
              v-for="ln in printDataColumn(item, header)"
              v-bind:key="ln + Math.random()"
              style="display: block"
              >{{ ln }}</span
            >
          </p>
        </template>
      </v-data-table>
    </v-card>
    <v-row v-if="massActions && massActions.length > 0 && selectable">
      <v-col class="text-right">
        <template v-for="action in massActions">
          <v-btn
            small
            v-bind:key="action.label"
            class="ml-2"
            :color="action.color"
            @click="executeAfterWarning(action, selected)"
            :disabled="
              action.forceVisible
                ? !action.forceVisible
                : (action.guard && !action.guard(selected)) ||
                  selected.length < 1
            "
            >{{ action.label }}</v-btn
          >
        </template>
      </v-col>
    </v-row>
    <v-row class="pb-8"></v-row>
  </div>
</template>
<script>
var _ = require("lodash");
import Vue from "vue";
import router from "@/router";

import XLSX from "xlsx";
import moment, { months } from "moment";
import endPointSelector from "@/plugins/endpoint-selector";
import Sortable from "sortablejs";

function watchClass(targetNode, classToWatch) {
  let lastClassState = targetNode.classList.contains(classToWatch);
  const observer = new MutationObserver((mutationsList) => {
    for (let i = 0; i < mutationsList.length; i++) {
      const mutation = mutationsList[i];
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const currentClassState =
          mutation.target.classList.contains(classToWatch);
        if (lastClassState !== currentClassState) {
          lastClassState = currentClassState;
          if (!currentClassState) {
            mutation.target.classList.add("sortHandle");
          }
        }
      }
    }
  });
  observer.observe(targetNode, { attributes: true });
}

const FIELD_PER_COLUMN = 8;
const FIELD_MAX_STR_LEN = 36; //length of an uuid
const MIN_WRAP_AMOUNT = 16;
const MAX_WRAP_AMOUNT = 256;
const DEFAULT_WORD_WRAP = "wrap";

const EXPORT_LIMIT_FOR_EXCEL = 100000;

export default {
  name: "p-datagrid",
  props: {
    allowQuickSearch: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    statefull: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    bulkLimit: {
      default: () => "",
    },
    defaultFilter: {
      required: false,
      default: () => null, //{}
    },
    thin: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    searchable: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    paginatable: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    exportable: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    selectable: {
      //shouldhave unique column
      type: Boolean,
      required: false,
      default: () => false,
    },
    singleSelect: {
      //shouldhave unique column
      type: Boolean,
      required: false,
      default: () => false,
    },
    uniqueColumn: {
      type: String,
      required: false,
      default: () => null,
    },
    internal: {
      required: false,
      default: () => 0,
    },
    icon: {
      type: String,
      required: false,
      default: () => "format_list_numbered",
    },
    caption: {
      type: String,
      required: false,
      default: () => null,
    },
    url: {
      type: String,
      required: true,
      default: () => "/",
    },
    exportUrl: {
      type: String,
      default: () => null,
    },
    headers: {
      type: Array,
      required: true,
      default: () => [],
    },
    filters: {
      type: Array,
      required: false,
      default: () => [],
    },
    rowActions: {
      type: Array,
      required: false,
      default: () => [],
    },
    extraRowActions: {
      type: Array,
      required: false,
      default: () => [],
    },
    massActions: {
      type: Array,
      required: false,
      default: () => [],
    },
    actions: {
      type: Array,
      required: false,
      default: () => [],
    },
    exportManipulator: {
      type: Function,
      required: false,
      default: null,
    },
    exportLimit: {
      type: Number,
      required: false,
      default: () => parseInt(process.env.VUE_APP_ITEMS_PER_PAGE_LIMIT),
    },
  },
  data: (vm) => ({
    //consts
    fieldPerColumn: FIELD_PER_COLUMN,
    minWrapAmount: MIN_WRAP_AMOUNT,
    maxWrapAmount: MAX_WRAP_AMOUNT,
    maxStrLen: FIELD_MAX_STR_LEN,
    daysOfWeek: vm.$t("datePicker.daysOfWeek"),
    dates: [], //For period options: day
    //
    tabsModel: 0,
    peekThumbLabel: true,
    wordwrap: DEFAULT_WORD_WRAP,
    wrapamount: FIELD_MAX_STR_LEN,
    multisearch: {},
    fieldVisibilites: [],
    fieldVisibilites_ex: [],
    columnSortKey: 1,
    columnOrders: {},
    forceUpdateHeaders: 0,
    filtersQuickModel: [],

    limit: parseInt(process.env.VUE_APP_ITEMS_PER_PAGE_LIMIT) || 2500,
    runningRowActions: [],
    exportLoading: false,
    //
    exOptions: null,
    //
    search: "",
    selected: [],
    totalDataCount: 0,
    data: [],
    loading: true,
    optionsBinded: false,
    options: {
      filters: {
        //search: ""
      },
    },
    footerOptions: {
      "items-per-page-options": [10, 25, 50, 100, 250],
      "show-current-page": true,
      "show-first-last-page": true,
    },
    itemsPerPage: Math.min(
      parseInt(localStorage.getItem("datagrid-itemsPerpage") || 25),
      vm.limit
    ),
    downloadNotFoundMap: {},
  }),
  computed: {
    computedViewHasChanged() {
      if (
        this.computedHiddenColumnCount > 0 ||
        Object.keys(this.columnOrders).length > 0
      ) {
        return true;
      }
      return false;
    },
    computedHiddenColumnCount() {
      if (this.fieldVisibilites.length == 0) {
        return 0;
      }
      return this.computedHeadersLength - this.fieldVisibilites.length;
    },
    computedHeadersWithVisiblityFilter() {
      return this.computedHeaders.filter((item) => {
        if (
          this.fieldVisibilites.length > 0 &&
          this.fieldVisibilites.indexOf(item.value) == -1
        ) {
          return null;
        }
        return item;
      });
    },
    computedHeaders: {
      get() {
        let dummy = this.forceUpdateHeaders % 2; // trick to update headers
        let ret = this.headers.filter((item) => {
          if (this.thin) {
            item.sortable = false;
          }
          if (item.visible === false) {
            return null;
          }
          return item;
        });

        return ret.sort((a, b) => {
          return this.columnOrders[a.value]
            ? this.columnOrders[a.value] - this.columnOrders[b.value]
            : 0;
        });
      },
      set(val) {
        this.columnOrders = {};
        val.forEach((v, i) => {
          this.columnOrders[v.value] = i;
        });
        this.forceUpdateHeaders++; // trick to update headers
      },
    },
    computedHeadersLength() {
      return Object.keys(this.computedHeaders).length;
    },
    computedHeadersAll() {
      return this.headers.filter((item) => {
        if (this.thin) {
          item.sortable = false;
        }
        if (item.visible === false) {
          // return null;
        }
        if (item.callable) {
          item.callable_ = item.callable.toString();
        }
        return item;
      });
    },
    computedLookupsAll() {
      var variables = [];
      for (var index in this.headers) {
        var item = this.headers[index];
        if (item.callable) {
          var s = item.callable.toString();
          var startSearch = 0;
          var handbreak = 0;
          var pos;
          // console.log(s);

          while ((pos = s.indexOf(".", startSearch)) > -1) {
            // console.log("vm search loop");
            handbreak++;
            if (handbreak > 100) {
              // console.log(`HAND BREAKED`);
              break;
            }
            var variable = "";
            var i = pos + 1; //searchForStr vm.
            while (i < s.length) {
              var c = s.charAt(i);
              // console.log(`found char: ${c}`);
              if (c.match(/[a-z]/i)) {
                variable += c;
              } else {
                break;
              }
              i++;
            }
            // console.log(`variable:${variable}`);
            if (variables.indexOf(variable) == -1) {
              variables.push(variable);
            }
            startSearch = pos + 1;
          }
        }
      }
      if (variables.length > 0) {
        var d = {};
        for (var ind in variables) {
          //console.log(`variables[ind]: ${variables[ind]}`);
          var vv = this.$parent.$parent._data[variables[ind]];
          if (vv) {
            d[variables[ind]] = vv;
          }
        }
        // console.log(this.$parent.$parent._data);
        // console.log(d);
        return d;
      }
      return null;
    },
    // a computed getter
    exportHeaderObject() {
      let ret = {};
      this.headers.forEach((k) => {
        if (!k.unExportable) {
          ret[k.value] = k.text;
        }
      });
      return ret;
    },
    exportFileName() {
      return (
        (this.caption + "")
          .replaceTurkish()
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase() + ".xlsx"
      );
    },
    formatedHeaders() {
      // `this` points to the vm instance
      let h = [];
      this.headers.forEach((k) => {
        //if (k.format || k.callable) {
        if (k.value != "action" && k.value != "extra_action") {
          h.push(k);
        }
      });
      return h;
    },
  },
  watch: {
    tabsModel: {
      handler(val) {
        localStorage.setItem("datagrid-searchtype", val);
        //console.log(`tab is changing: ${val}`);
      },
    },
    wrapamount: {
      handler(val) {
        localStorage.setItem("datagrid-wrapamount", val);
        if (this.wrapamount > MAX_WRAP_AMOUNT) {
          this.wrapamount = MAX_WRAP_AMOUNT;
        }
        if (this.wrapamount < MIN_WRAP_AMOUNT) {
          this.wrapamount = MIN_WRAP_AMOUNT;
        }
      },
    },
    wordwrap: {
      handler(val) {
        localStorage.setItem("datagrid-wordwrap", val);
      },
    },
    filtersQuickModel: {
      handler(val) {
        if (!this.debouncedSetFilters) {
          return;
        }
        if (
          !this.$refs.searchCombobox ||
          !this.$refs.searchCombobox.canStartSearch()
        ) {
          console.log(`cant't start search yet`);
          return;
        }
        console.log(
          `multisearch: ${this.$refs.searchCombobox.canStartSearch()}`
        );

        var sm = this.$refs.searchCombobox.asSourceMapping();
        console.log(sm);
        // for (let i in sm) {
        //   let v = sm[i];
        this.filters.forEach((f, fk) => {
          console.log(
            `each.filter: hasQuick: ${
              Object.keys(sm).indexOf(f.name) > -1
            }, or HasModel:${!!f.model}`
          );
          if (Object.keys(sm).indexOf(f.name) > -1 || !!f.model) {
            console.log(
              `setting filter [${fk}], ${f.name} to value ${sm[f.name] || null}`
            );
            Vue.set(this.filters[fk], "model", sm[f.name] || null);
            // f.model = v;
          }
        });
      },
      deep: true,
      immediate: true,
    },
    fieldVisibilites: {
      handler(val) {
        if (val.length > 0) {
          this.saveFieldVisibilites();
          this.fieldVisibilites_ex = JSON.parse(JSON.stringify(val));
        } else {
          this.fieldVisibilites = JSON.parse(
            JSON.stringify(this.fieldVisibilites_ex)
          );
        }
      },
    },
    filters: {
      handler(val) {
        if (!this.debouncedSetFilters) {
          return;
        }
        this.debouncedSetFilters(val);
      },
      deep: true,
      immediate: true,
    },
    options: {
      handler() {
        if (this.optionsBinded) {
          console.log(`watch: options ${JSON.stringify(this.options)}`);
          this.debouncedSetRequestOptions();
        } else {
          console.info(`request options generated for first time`);
          this.optionsBinded = true;
        }
      },
      deep: true,
    },
    search() {
      console.log(`watch: search`);
      this.debouncedSetSearch();
    },
  },
  mounted() {
    console.log(
      "fetch=>mounted, statefull: " + this.statefull + ", url: " + this.url
    );

    this.loadFieldVisibilites();
    this.loadFieldDisplayOrder();
    this.loadWordWrap();
    this.loadSearchWindow();

    if (this.statefull) {
      if (!this.$route.query.state) {
        let key = Math.random();
        console.log(`generating new state with key: ${key}`);
        router.replace({
          path: window.location.path,
          query: { state: key },
        });
      } else {
        // this.$nextTick(() => {
        this.resumeState(this.$route.query.state);
        // });
      }
    }

    this.exOptions = JSON.parse(JSON.stringify(this.options)); //copy

    console.log(`calling fetch data in mount`);
    this.fetchData();
  },
  created() {
    console.log(`datagrid created`);

    this.debouncedSetSearch = _.debounce(() => {
      console.log("debouncedSetSearch:" + this.search);
      this.options.filters.search = this.search;
      this.options.page = 1; //always start from begining
    }, 1000);

    this.debouncedSetFilters = _.debounce((val) => {
      console.log(`debouncedSetFilters: ` + val.length);

      let data = {
        //search: this.search
      };

      let assignedFilter = false;

      val.forEach((v) => {
        var filt = v.model;
        if (v.model instanceof Date) {
          filt = this.utils.formatDateTimeSQL(v.model);
        }

        switch (v.dataType) {
          case "int":
            filt = parseInt(filt);
            break;
          case "float":
            filt = parseFloat(filt);
            break;
          default:
            break;
        }

        //console.log(`assign filter => ${v.name} to ${filt}`);
        if (
          //(filt && this.options.filters[v.name] != filt) || //problematic
          filt ||
          (!filt && this.options.filters[v.name])
        ) {
          console.log(`yep assigned`);
          assignedFilter = true;
          data[v.name] = filt;
        }
      });
      if (assignedFilter) {
        console.log(`assign value to options 1`);
        this.options.filters = data;
        this.options.page = 1; //always start from begining
      }
      this.$refs.searchCombobox && this.$refs.searchCombobox.setBusy(true);
      this.$nextTick(() => {
        this.$refs.searchCombobox &&
          this.$refs.searchCombobox.bindNewValues(this.filters);
      });
      this.$refs.searchCombobox && this.$refs.searchCombobox.setBusy(false);
    }, 1000);

    this.debouncedSetRequestOptions = _.debounce(() => {
      console.log("debouncedSetRequestOptions");

      if (this.optionsHasBeenChanged()) {
        console.log(`calling fetchData, options has changed`);
        // console.log(`co: ${co}\neo: ${eo}`);
        this.fetchData();
      } else {
        //console.log(`co: ${co}\neo: ${eo}`);
        // console.log(this.options);
        console.info(`protect from duplicate calls!`);
      }
      // let co = JSON.stringify(this.options);
      // let eo = JSON.stringify(this.exOptions);
      // if (co != eo) {
      //   console.log("fetch=>optionsHandler");
      //   console.log(`co: ${co}\neo: ${eo}`);
      //   this.fetchData();
      // } else {
      //   console.log(`co: ${co}\neo: ${eo}`);
      //   //protect from duplicate calls!
      // }
      this.exOptions = JSON.parse(JSON.stringify(this.options)); //copy
      localStorage.setItem("datagrid-itemsPerpage", this.options.itemsPerPage);
    }, 100);
  },
  directives: {
    "sortable-table": {
      inserted: (el, binding, vnode) => {
        var selectable = vnode.context._props.selectable;
        el.querySelectorAll("th").forEach((draggableEl) => {
          // Need a class watcher because sorting v-data-table rows asc/desc removes the sortHandle class
          watchClass(draggableEl, "sortHandle");
          draggableEl.classList.add("sortHandle");
        });

        Sortable.create(
          el.querySelector("tr"),
          binding.value
            ? {
                ...binding.value,
                handle: ".sortHandle",
                filter: selectable ? "th:first-child" : "",
              }
            : { filter: selectable ? "th:first-child" : "" }
        );
      },
    },
  },
  methods: {
    async trackExportStatus(requestId, jobId, exportActionText) {
      try {
        var res = await this.axios.get(
          `/inapi/export/status/${requestId}`
        );

        if (res.data.status == "NOT_FOUND") {
          if (this.downloadNotFoundMap[requestId + jobId] > 2) {
            this.notifier.remove(requestId + jobId);
            return;
          }
          this.downloadNotFoundMap[requestId + jobId] =
            this.downloadNotFoundMap[requestId + jobId] || 0;
          this.downloadNotFoundMap[requestId + jobId]++;

          try {
            var rescheck = await this.axios.get(
              `/inapi/export/exists/${requestId}/${jobId}`
            );
            //first not found check status then show download
            var dlUrl = `/inapi/export/download/${requestId}/${jobId}/${encodeURI(
              this.caption
            )}`;

            this.notifier.putSuccess(
              requestId + jobId,
              "download",
              this.$t("messages.downloadLinkIsReady"),
              exportActionText,
              this.$t("messages.youCanDownloadByClickingHere"),
              dlUrl,
              true
            );
            return;
          } catch (e) {
            null;
          }
        } else if (res.data.status == "ERROR") {
          this.notifier.putError(
            requestId + jobId,
            "error",
            this.$t("errors.anErrorOccured"),
            exportActionText,
            res.data.message,
            null,
            true
          );
          return;
        }

        this.notifier.putProgress(
          requestId + jobId,
          "hourglass_bottom",
          this.$t("messages.exportingProgress"),
          exportActionText,
          res.data.message,
          res.data.progress,
          null,
          false
        );

        setTimeout(
          () => this.trackExportStatus(requestId, jobId, exportActionText),
          10000
        );
      } catch (e) {
        this.notifier.remove(requestId + jobId);
      }
    },
    incWrapAmount(amount) {
      this.wrapamount += amount;
      if (this.wrapamount > MAX_WRAP_AMOUNT) {
        this.wrapamount = MAX_WRAP_AMOUNT;
      }
      if (this.wrapamount < MIN_WRAP_AMOUNT) {
        this.wrapamount = MIN_WRAP_AMOUNT;
      }
      this.peekThumbLabel = "always";

      this.debouncedSetPeekLabel ||
        (this.debouncedSetPeekLabel = _.debounce(() => {
          this.peekThumbLabel = true;
        }, 1000));

      this.debouncedSetPeekLabel();
    },
    printDataColumn(item, header) {
      var s = item[header.value];
      if (header.callable) {
        s = header.callable(item);
      }
      var ret = [s];
      if (this.wordwrap == "hide") {
        if (
          !header.nowrap &&
          typeof s == "string" &&
          s.length > this.wrapamount + 1
        ) {
          s = s.substring(0, this.wrapamount) + "...";
          ret = [s];
        }
      } else if (this.wordwrap == "wrap") {
        if (
          !header.nowrap &&
          typeof s == "string" &&
          s.length > this.wrapamount + 1
        ) {
          var temp = s.split(" ");
          if (temp.length < 2) {
            var replace = "(.{" + this.wrapamount + "})";
            var re = new RegExp(replace, "g");
            s = s.replace(re, "$1||");
            ret = s.split("||");
          } else {
            console.log("============");
            ret = [];
            var letIndex = -1;
            for (let ind in temp) {
              let stn = temp[ind];
              console.log(`stn: ${stn}, letIndex: ${letIndex}`);
              // if (stn.length <= this.wrapamount || ind + 1 == temp.length) {
              if (letIndex == -1) {
                console.log(`pushing to pos 0`);
                ret.push(stn);
                letIndex++;
              } else {
                if ((ret[letIndex] + stn + "").length <= this.wrapamount) {
                  ret[letIndex] += " " + stn;
                  console.log(`merging index ${letIndex} `);
                } else {
                  console.log(`pushing new position`);
                  ret.push(stn);
                  letIndex++;
                }
              }
              // }
            }
          }
        }
      }
      return ret;
    },
    weekdayFormat(d) {
      let i = new Date(d).getDay(d);
      return this.daysOfWeek[i];
    },
    restoreView() {
      this.fieldVisibilites = [];
      this.saveFieldVisibilites();
      this.loadFieldVisibilites();
      this.columnOrders = {};
      this.wrapamount = FIELD_MAX_STR_LEN;
      this.wordwrap = DEFAULT_WORD_WRAP;
      this.saveFieldDisplayOrder();
    },
    updateHeaderOrder(evt) {
      const oldIndex = evt.oldIndex - (this.selectable ? 1 : 0);
      const newIndex = evt.newIndex - (this.selectable ? 1 : 0);

      console.log(`updateHeaderOrder: ${oldIndex} to ${newIndex}`);
      if (oldIndex == newIndex) {
        console.warn(`indexes are the same: ${oldIndex}`);
        return;
      }
      if (oldIndex < 0 || newIndex < 0) {
        this.columnSortKey++;
        console.warn("out of bounds");
        return;
      }
      const headersTmp = this.computedHeaders;

      if (newIndex >= headersTmp.length) {
        let k = newIndex - headersTmp.length + 1;
        while (k--) {
          headersTmp.push(undefined);
        }
      }
      headersTmp.splice(newIndex, 0, headersTmp.splice(oldIndex, 1)[0]);
      // console.log("headersTmp");
      // console.log(headersTmp);
      this.computedHeaders = headersTmp;
      this.columnSortKey++;
      this.saveFieldDisplayOrder();
    },
    loadWordWrap() {
      let temp = localStorage.getItem("datagrid-wordwrap");
      let temp2 = localStorage.getItem("datagrid-wrapamount");
      if (!temp) {
        return;
      }
      this.wordwrap = temp;
      if (!temp2) {
        return;
      }
      this.wrapamount = parseInt(temp2);
    },
    loadSearchWindow() {
      var ss = localStorage.getItem("datagrid-searchtype");
      if (!ss) {
        return;
      }
      var searchTypeCount = 0;
      if (
        !this.thin &&
        this.filters &&
        this.filters.length > 0 &&
        this.searchable &&
        this.allowQuickSearch
      ) {
        searchTypeCount++;
        //hasQuickSearch 0 means quick
      }

      if (
        this.filters &&
        this.filters.length > 0 &&
        this.searchable &&
        this.allowQuickSearch
      ) {
        searchTypeCount++;
        //has detailed Filters
      }
      if (searchTypeCount == 1) {
        // 1 tane var hangisi olacak;
        console.log(`override tab index`);
        this.tabsModel = 0;
      }
      this.tabsModel = parseInt(ss);
    },
    loadFieldDisplayOrder() {
      let key = `datagrid-field-order-${this.$route.path}`;
      let temp = localStorage.getItem(key);
      if (!temp) {
        return;
      }
      this.columnOrders = JSON.parse(temp);
    },
    saveFieldDisplayOrder() {
      let key = `datagrid-field-order-${this.$route.path}`;
      if (Object.keys(this.columnOrders).length < 1) {
        localStorage.removeItem(key);
        return;
      }
      localStorage.setItem(key, JSON.stringify(this.columnOrders));
    },
    saveFieldVisibilites() {
      let key = `datagrid-fields-${this.$route.path}`;
      if (
        this.fieldVisibilites.length == 0 ||
        this.fieldVisibilites.length == this.computedHeaders.length
      ) {
        localStorage.removeItem(key);
        return;
      }
      localStorage.setItem(key, JSON.stringify(this.fieldVisibilites));
    },
    loadFieldVisibilites() {
      let key = `datagrid-fields-${this.$route.path}`;
      let temp = localStorage.getItem(key);
      if (!temp) {
        this.computedHeaders.forEach((v) => {
          this.fieldVisibilites.push(v.value);
        });
        console.log(this.fieldVisibilites);
        return;
      }
      this.fieldVisibilites = JSON.parse(temp);
    },
    saveState(key) {
      console.log(`saving state: ${key}`);
      localStorage.setItem("dg-state-" + key, JSON.stringify(this.options));
    },
    resumeState(key) {
      console.log(`resuming state: ${key}`);

      var st = localStorage.getItem("dg-state-" + key);
      if (!st) {
        return;
      }
      localStorage.removeItem("dg-state-" + key);
      var opt = JSON.parse(st);
      // console.log(`resuming state`);
      //console.log(this.filters);
      for (let i in opt.filters) {
        //console.log(`setting ${i} with: ${opt.filters[i]}`);

        let dummyIndex;
        let reduce = this.filters.filter((f, pos) => {
          if (f.name == i) {
            dummyIndex = pos;
          }
          return f.name == i;
        });

        console.log(`assign value to options 2`);
        if (reduce.length == 1) {
          //console.log(`settinggggg....`);
          Vue.set(this.filters[dummyIndex], "model", opt.filters[i]);
          this.options.filters[i] = opt.filters[i];
          //this.filters[dummyIndex].model = opt.filters[i];
        }
      }
      this.options.sortBy = opt.sortBy;
      this.options.sortDesc = opt.sortDesc;
      this.options.page = opt.page;
      this.options.itemsPerPage = opt.itemsPerPage;
      // this.itemsPerPage = opt.itemsPerPage;

      //  alert('resume state: '+key);

      //console.log(opt);
    },
    getMinMax(ss) {
      if (!ss) {
        return undefined;
      }
      if (ss[0] != "$") {
        return ss;
      }
      var sstr = ss.replace("$", "");
      // console.log(`ss: ${ss}, sstr: ${sstr}`);
      for (let i in this.filters) {
        let f = this.filters[i];
        if (f.name == sstr) {
          // console.log(`fname==sstr; ${f.model} returns`);
          return f.model;
        }
      }
      return undefined;
    },
    typeof(x) {
      if (x === null || x === undefined) {
        return "string";
      }
      if (typeof x === "object" && x.length !== undefined) {
        return "array";
      }
      return typeof x;
    },
    optionsHasBeenChanged() {
      var checkR = (node, node2) => {
        if (Object.keys(node)[0] === "who") {
          return true; //dont check who
        }
        // console.log(`checkR`);
        // console.log(node);
        // console.log(node2);
        var $return = true;
        for (let on in node) {
          var ov = node[on];
          var ov2 = node2 && node2[on];
          var typeoff = this.typeof(ov);
          if (ov2 === undefined || ov2 === null || ov2 === "") {
            ov2 = null;
          }
          if (ov === undefined || ov === null || ov === "") {
            ov = null;
          }
          // console.log(
          //   `${on}, type: ${typeoff}, ${JSON.stringify(ov)} ?? ${JSON.stringify(
          //     ov2
          //   )} `
          // );
          switch (typeoff) {
            case "object":
              $return = checkR(ov, ov2);
              break;
            case "array":
              if (ov2 === null || ov2[0] === undefined) {
                ov2 = [];
              }
              if (ov[0] === undefined) {
                ov = [];
              }
              var arrEqual = true;
              var greaterArray = ov;
              var lesserArray = ov2;
              if (ov2.length > ov) {
                greaterArray = ov2;
                lesserArray = ov;
              }
              for (let i = 0; i < greaterArray.length; i++) {
                if (
                  greaterArray[i] === undefined ||
                  greaterArray[i] === null ||
                  greaterArray[i] === ""
                ) {
                  greaterArray[i] = null;
                }
                if (
                  lesserArray[i] === undefined ||
                  lesserArray[i] === null ||
                  lesserArray[i] === ""
                ) {
                  lesserArray[i] = null;
                }
                arrEqual &= greaterArray[i] == lesserArray[i];
              }
              $return = arrEqual;
              break;
            default:
              $return = ov === ov2;
          }
          if (!$return) {
            break; //loop;
          }
        }
        // console.log(`return is ${!!$return}`);
        return $return;
      };
      // console.log(`will check equality`);
      if (this.options.who && !this.exOptions.who) {
        this.exOptions.who = JSON.parse(JSON.stringify(this.options.who));
      }
      // console.log(this.options);
      // console.log(this.exOptions);
      return !checkR(this.options, this.exOptions);
    },
    stringifyAction(action, item) {
      return (
        action.icon +
          "_" +
          (action.hint || "").replaceTurkish() +
          "_" +
          action.color +
          "_" +
          item[this.uniqueColumn] || JSON.stringify(item)
      );
    },
    async runRowAction(action, item) {
      var actual = async function () {
        //console.log("beg");
        var key = this.stringifyAction(action, item);

        this.runningRowActions.push(key);
        //console.log(`runningRowActions: ${this.runningRowActions}`);

        await action.action(item, action);
        //console.log("end");

        this.runningRowActions = _.remove(this.runningRowActions, function (n) {
          //console.log(`runningrov actions remove ${n}, will it: ${n != key}`);
          return n != key;
        });
      };
      if (!action.warn) {
        return actual.call(this);
      }
      this.$dialog
        .confirm({ text: this.$t("messages.areYouSure") })
        .then((t) => {
          return !t || actual.call(this);
        });
    },
    async exportExcel() {
      var exportXLS = async () => {
        this.showLoadingForExcel();
        try {
          //console.log(this.exportHeaderObject);

          var data = await this.fetchDataToExport();
          if (!data) {
            return;
          }

          var exportHeaderObject = this.exportHeaderObject;

          if (this.exportManipulator) {
            this.exportManipulator(data, exportHeaderObject);
          }

          var exportData = [[this.caption], _.values(exportHeaderObject)];

          let _exportLookups = [
            { key: this.$t("exportLookups.true"), value: "true" },
            { key: this.$t("exportLookups.false"), value: "false" },
            { key: this.$t("exportLookups.active"), value: "Active" },
            { key: this.$t("exportLookups.passive"), value: "Passive" },
            { key: this.$t("exportLookups.y"), value: "Y" },
            { key: this.$t("exportLookups.n"), value: "N" },
            { key: this.$t("exportLookups.yes"), value: "Yes" },
            { key: this.$t("exportLookups.no"), value: "No" },
            { key: this.$t("exportLookups.complete"), value: "COMPLETE" },
            { key: this.$t("exportLookups.pending"), value: "PENDING" },
            { key: this.$t("exportLookups.error"), value: "ERROR" },
            { key: this.$t("exportLookups.wait"), value: "WAIT" },
            { key: this.$t("exportLookups.new"), value: "NEW" },
            { key: this.$t("exportLookups.approved"), value: "APPROVED" },
            { key: this.$t("exportLookups.cancelled"), value: "CANCELLED" },
            { key: this.$t("exportLookups.sent"), value: "P" },
          ];

          for (var rowindex in data) {
            var row = data[rowindex];
            var temprow = [];
            for (var colkey in this.exportHeaderObject) {
              var v = _.get(row, colkey);

              if (v === undefined || v === null) {
                v = "";
              }

              _exportLookups.find((obj, i) => {
                if (obj.value === v) {
                  v = obj.key;
                  return true;
                }
              });

              temprow.push(v);
            }
            exportData.push(temprow);
          }

          const ws = XLSX.utils.aoa_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
          /* generate file and send to client */
          XLSX.writeFile(wb, this.exportFileName);
        } finally {
          this.hideLoadingForExcel();
        }
      };
      console.log(
        `export: this.totalDataCount: ${this.totalDataCount}, and the limit is ${this.exportLimit}`
      );
      if (this.totalDataCount <= this.exportLimit) {
        exportXLS.call(this);
      } else {
        this.$dialog
          .confirm({
            text: this.$t("messages.dataTooHugeToExport", {
              limit: this.exportLimit,
              current: this.totalDataCount,
            }),
            actions: {
              false: this.$t("messages.exportAllDataBackground", {
                limit: this.totalDataCount,
              }),
              true: {
                text: this.$t("messages.exportLimitedData", {
                  limit: this.exportLimit,
                }),
                color: "primary",
              },
            },
          })
          .then((t) => {
            if (t) {
              exportXLS.call(this);
            } else {
              if (t === undefined) {
                return;
              }
              var lastExportedType =
                localStorage.getItem("datagrid-lastExportedType") || "";
              var lastExportedEmail =
                localStorage.getItem("datagrid-lastExportedEmail") || "";

              var allowOnlyCSV = this.totalDataCount > EXPORT_LIMIT_FOR_EXCEL;

              this.$dialog
                .export({
                  text: "Gönderilecek e-posta adresini girin",
                  title: "E-Posta Adresi",
                  value: lastExportedEmail,
                  option: lastExportedType,
                  onlyCSV: allowOnlyCSV,
                  limit: EXPORT_LIMIT_FOR_EXCEL,
                })
                .then((resp) => {
                  if (!resp || !resp.mail) {
                    return;
                  }
                  var validations = this.validation()
                    .required()
                    .email()
                    .toRules("E-Posta Adresi");

                  var valres = null;
                  for (let z in validations) {
                    let func = validations[z];
                    let temp = func(resp.mail);
                    //console.log(`valres: ${valres}`);
                    if (temp !== true && temp) {
                      valres = temp;
                      break;
                    }
                  }
                  if (valres) {
                    this.$dialog.error({ text: valres });
                    return;
                  }
                  localStorage.setItem("datagrid-lastExportedEmail", resp.mail);
                  localStorage.setItem("datagrid-lastExportedType", resp.type);
                  let options = JSON.parse(JSON.stringify(this.options));
                  if (this.defaultFilter) {
                    for (let i in this.defaultFilter) {
                      options.filters[i] = this.defaultFilter[i];
                    }
                  }
                  options.namespace = endPointSelector().replace("test", "");
                  // options.internal = this.internal;
                  options.date = moment(new Date()).format("LLLL"); // Friday, March 26, 2021 8:47 AM
                  options.caption = this.caption;
                  options.headers = this.computedHeadersAll;
                  options.lookups = this.computedLookupsAll;
                  options.url = this.url;
                  options.exportUrl = this.exportUrl || "";
                  options.email = resp.mail;
                  options.bulkLimit = this.bulkLimit || "";
                  options.type = resp.type;
                  this.exportLoading = true;
                  this.downloadNotFoundMap = {};
                  this.axios
                    .post("/inapi/export/request", options)
                    .then((response) => {
                      setTimeout(
                        () =>
                          this.trackExportStatus(
                            response.data.requestId,
                            response.data.jobId,
                            options.caption + " - " + options.date
                          ),
                        1000
                      );

                      this.exportLoading = false;
                      this.$dialog.notify.info(
                        this.$t("messages.willMailYourExport", {
                          mail: resp.mail,
                        }),
                        {
                          position: "bottom-right",
                        }
                      );
                    })
                    .catch((error) => {
                      this.exportLoading = false;
                      this.$dialog.error({ text: error.response.data.message });
                    });
                });
            }
          });
      }
    },
    refresh() {
      console.log("datagrid.refresh.called");
      this.fetchData();
    },
    concatItem(s) {
      return "item." + s;
    },
    async executeAfterWarning(action, selected) {
      if (selected.length < 1) {
        if (!action.forceVisible) {
          return;
        }
      }
      if (!action.warn) {
        this.loading = true;
        try {
          await action.action(selected);
          this.selected = [];
        } finally {
          this.loading = false;
        }
      } else {
        this.$dialog
          .confirm({ text: this.$t("messages.areYouSure") })
          .then(async (t) => {
            if (!t) {
              this.selected = [];
              return;
            }
            this.loading = true;
            try {
              await action.action(selected);
              this.selected = [];
            } finally {
              this.loading = false;
            }
          });
      }
    },
    clearFilters() {
      console.log(`clearing filters`);

      let hasFilter =
        0 <
        this.filters.filter((f) => {
          console.log(`has filter: ${f.model}`);
          return !!f.model;
        }).length;

      if (!hasFilter) {
        return this.fetchData();
      }
      this.search = null;
      for (let i in this.filters) {
        this.filters[i].model && Vue.set(this.filters[i], "model", null);
      }
      this.selected = [];
    },
    clearSorting() {
      console.log(`clearing sorting`);
      this.options.sortDesc = [false];
      this.options.sortBy = [""];
    },
    async fetchDataToExport() {
      console.log(`fetchDataToExport ${this.url}`);

      let options = JSON.parse(JSON.stringify(this.options));
      options.export = true;
      options.page = 1;
      options.itemsPerPage = this.exportLimit;

      if (this.defaultFilter) {
        console.log(`applyDefaultFilters`);
        for (let i in this.defaultFilter) {
          options.filters[i] = this.defaultFilter[i];
        }
      }

      console.log(`with headers ${JSON.stringify(this.exportHeaderObject)}`);
      console.log(`with exportFileName ${this.exportFileName}`);
      console.log(`with exportFooters ${JSON.stringify(this.exportFooter)}`);
      console.log(`with options ${JSON.stringify(options)}`);

      var url = this.exportUrl || this.url;
      try {
        const response = await this.axios.post(url, options);
        return response.data.data;
      } catch (error) {
        this.exportLoading = false;
        this.$dialog.error({ text: error.response.data.message });
      }
    },
    showLoadingForExcel() {
      this.exportLoading = true;
      this.$dialog.notify.info(this.$t("dataTable.preparingYourDump"), {
        position: "top-right",
      });
    },
    hideLoadingForExcel() {
      this.exportLoading = false;
      this.$dialog.notify.success(this.$t("dataTable.yourDumpIsReady"), {
        position: "top-right",
      });
    },
    fetchData() {
      this.loading = true;
      console.log(
        `Fetching From ${this.url}: with: ${JSON.stringify(this.options)}`
      );

      let options = JSON.parse(JSON.stringify(this.options));
      if (!this.paginatable || this.thin) {
        options.page = 1;
        options.itemsPerPage = this.limit;
      }

      if (this.defaultFilter) {
        console.log(`applyDefaultFilters`);
        for (let i in this.defaultFilter) {
          for (let op in options.filters) {
            if (i == op) {
              this.defaultFilter[i] = options.filters[op];
            }
          }
          options.filters[i] = this.defaultFilter[i];
        }
      }
      console.log(`axios working`);
      this.axios
        .post(this.url, options)
        .then((response) => {
          // console.log(this.headers);
          this.data = response.data.data;
          this.totalDataCount = response.data.total * 1; //Converts 'total' (string) to integer.

          var i =
            parseInt(
              parseInt(this.options.page - 1) * this.options.itemsPerPage
            ) + 1;
          if (this.totalDataCount > 0) {
            this.data.forEach((d) => {
              d.ai = i++;
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$dialog.error({ text: error.response.data.message });
        })
        .then(() => {
          this.loading = false;
        });
    },
  },
};
</script>
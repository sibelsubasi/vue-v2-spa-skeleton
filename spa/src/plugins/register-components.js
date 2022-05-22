import Vue from 'vue';

import pUniqueTextfield from "@/components/parts/p-unique-textfield";
import pCheckedTextfield from "@/components/parts/p-checked-texfield";
import pSpinner from "@/components/parts/p-spinner";
import pDatagrid from "@/components/parts/p-datagrid";
import pForm from "@/components/parts/p-form";
import pImporter from "@/components/parts/p-importer";
import pServerSideImporter from "@/components/parts/p-server-side-importer";
import pSinglePhotoUploader from "@/components/parts/p-single-photo-uploader";
import pLookup from "@/components/parts/p-lookup";
import pPeriodPicker from "@/components/parts/p-period-picker";
import pSearchCombobox from "@/components/parts/p-search-combobox";
import pTabForm from "@/components/parts/p-tab-form";
import pSideInfoBar from "@/components/parts/p-side-info-bar";
import pCurrencyTextfield from "@/components/parts/p-currency-textfield";
import pLoadingDialog from "@/components/parts/p-loading-dialog";
import pWarningDialog from "@/components/parts/p-warning-dialog";
import pInfoDialog from "@/components/parts/p-info-dialog";
import pActionsDialog from "@/components/parts/p-actions-dialog";

import aBreadcrumbs from "@/components/app/a-breadcrumbs";
import aFooter from "@/components/app/a-footer";
import aHeader from "@/components/app/a-header";
import aStepper from "@/components/app/a-stepper";

import VueApexCharts from 'vue-apexcharts';

Vue.component('p-unique-textfield', pUniqueTextfield);
Vue.component('p-checked-texfield', pCheckedTextfield);
Vue.component('p-spinner', pSpinner);
Vue.component('p-datagrid', pDatagrid);
Vue.component('p-form', pForm);
Vue.component('p-importer', pImporter);
Vue.component('p-server-side-importer', pServerSideImporter);
Vue.component('p-single-photo-uploader', pSinglePhotoUploader);
Vue.component('p-lookup', pLookup);
Vue.component('p-search-combobox', pSearchCombobox);
Vue.component('p-period-picker', pPeriodPicker);
Vue.component('p-tab-form', pTabForm);
Vue.component('p-side-info-bar', pSideInfoBar);
Vue.component('p-currency-textfield', pCurrencyTextfield);
Vue.component('p-loading-dialog', pLoadingDialog);
Vue.component('p-warning-dialog', pWarningDialog);
Vue.component('p-info-dialog', pInfoDialog);
Vue.component('p-actions-dialog', pActionsDialog);

Vue.component('a-breadcrumbs', aBreadcrumbs);
Vue.component('a-footer', aFooter);
Vue.component('a-header', aHeader);
Vue.component('a-stepper', aStepper);

Vue.component('v-chart', VueApexCharts);
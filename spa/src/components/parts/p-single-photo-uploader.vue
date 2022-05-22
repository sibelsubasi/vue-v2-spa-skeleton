<template>
  <div>
    <v-file-input
      @change="fileInputChange"
      v-model="imageFile"
      ref="imageFile"
      style="display:none"
      id="imageFile"
      :accept="acceptedFormats"
    ></v-file-input>
    <v-btn
      @click="openFileDialog"
      fab
      absolute
      small
      dark
      color="pink"
      style="right:0; bottom:25px"
    >
      <v-icon>add_a_photo</v-icon>
    </v-btn>
    <v-dialog
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :hide-overlay="$vuetify.breakpoint.smAndDown"
      :transition="$vuetify.breakpoint.smAndDown ? 'dialog-bottom-transition' : null"
      :persistent="loading"
      v-model="visible"
      scrollable
      max-width="1200px"
    >
      <v-card tile flat style="min-height:450px;">
        <v-card-title primary-title class="headline pa-0">
          <v-toolbar dark color="primary" flat>
            <v-btn icon dark v-if="$vuetify.breakpoint.smAndDown" :disabled="loading" @click="hide">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{$t('singlePhotoUploader.scale')}}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-toolbar-items v-if="$vuetify.breakpoint.smAndDown">
              <v-btn
                dark
                text
                large
                style="height:56px"
                :disabled="loading"
                @click="openFileDialog"
              >{{$t("actions.change")}}</v-btn>
              <v-btn
                dark
                text
                large
                style="height:56px"
                :loading="loading"
                :disabled="loading"
                @click="save"
              >{{$t("singlePhotoUploader.crop")}}</v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <cropper
                  ref="cropper"
                  style="max-height:400px; overflow:hidden"
                  class="cropper"
                  :src="img"
                  :stencilComponent="$options.components.CircleStencil"
                  @change="change"
                ></cropper>
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
          <v-btn
            class="mr-3"
            color="accent"
            v-if="$vuetify.breakpoint.mdAndUp"
            :disabled="loading"
            @click="openFileDialog"
          >{{$t("actions.change")}}</v-btn>
          <div v-if="$vuetify.breakpoint.mdAndUp">
            <v-btn
              color="primary"
              style="min-width:100px"
              :loading="loading"
              :disabled="false"
              @click="save"
            >{{$t("singlePhotoUploader.crop")}}</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>  
<script>
import Vue from "vue";
import { PreviewResult, BoundingBox, MoveableArea } from "vue-advanced-cropper";
import { Cropper, CircleStencil } from "vue-advanced-cropper";
import store from "@/store";
// var _ = require("lodash");
// import i18n from "@/plugins/vue-i18n";
export default {
  name: "p-profile-photo-uploader", 
  props: {
    saveUrl: {
      type: String,
      required: true,
    },
    afterLoad: {
      type: Function,
      required: false,
    },   
  },
  data: vm => ({
    loading: false,
    imageFile: null,
    visible: false
    // model: vm.value
  }),
  components: {
    Cropper,
    CircleStencil: CircleStencil // eslint-disable-line vue/no-unused-components
  },
  computed: {
    img() {
      if (this.imageFile) {
        return URL.createObjectURL(this.imageFile);
      }
      return null;
    },
    acceptedFormats() {
      return ["image/jpeg", "image/gif", "image/png"].join(", ");
    }
  },
  watch: {},
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
    change(e) {
      //console.log(e); coortdinates
    },
    async save() {
      this.loading = true;
      const { coordinates, canvas } = this.$refs.cropper.getResult();

      //var image = canvas.toDataURL();
      var $dis = this;
      await canvas.toBlob(
        async function(blob) {
          try {
            const formData = new FormData();

            var fn = $dis.imageFile.name;
            if (fn.indexOf(".")) {
              fn = fn
                .split(".")
                .slice(0, -1)
                .join(".");
            }
            fn += ".jpg";
            formData.append("imageFile", blob, fn);

            // Post via axios or other transport method
            var response = await $dis.axios.post($dis.saveUrl, formData, {
              headers: {
                "content-type": `multipart/form-data; boundary=${formData._boundary}`
              }
            });
            store.dispatch("updateUserData", {
              avatar: response.data.avatar
            });
            $dis.afterLoad && $dis.afterLoad(response.data.avatar);
            $dis.hide();
          } catch (error) {
            $dis.$dialog.error({ text: error.response.data.message });
          } finally {
            $dis.loading = false;
          }
        },
        "image/jpeg",
        0.92
      );
    },
    openFileDialog() {
      document.getElementById("imageFile").click();
    },
    fileInputChange(val) {
      if (!val || val.length < 1) {
        return;
      }
      this.show();
      console.log(val);
    },
    // updateValue: function(value) {
    //   this.$emit("input", value);
    // },
    async check() {}
  },
  created() {},
  mounted() {}
};
</script>
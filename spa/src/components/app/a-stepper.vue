<style>
.v-stepper__label {
  min-width: 180px;
  text-align: center !important;
  font-weight: 500 !important;
}
.v-stepper__step__step {
  font-weight: bold !important;
}
.v-stepper--alt-labels .v-stepper__header 
  {
    height: auto;
    padding: 16px;
  }
.v-stepper--alt-labels .v-stepper__step__step
  {
    margin-bottom:-52px;
    margin-left:0;
    margin-right:0
  }
.v-stepper--alt-labels .v-stepper__header .v-divider
  {
    margin: 35px -97px 0 !important;
  }

/* .v-stepper__step:hover {
  cursor: pointer !important;
}
.v-stepper__step:hover .v-stepper__step__step {
  background-color: #efdf00 !important;
} */

</style>

<template>
  <div class="mt-8 mb-12 mx-6">
    <v-stepper alt-labels flat :value="currentStep">
      <v-stepper-header>
          <v-stepper-step
            step="1"
            :complete="currentStep > 1 ? true : false"
            :color="currentStep == 1 ? 'yellow secondary--text' : 'secondary'"
          ><!-- @click="routerPush('application-home')" -->
            {{ $t("pages.stepper.step1") }}
          </v-stepper-step>

        <v-divider></v-divider>

          <v-stepper-step
            step="2"
            :complete="currentStep > 2 ? true : false"
            :color="currentStep == 2 ? 'yellow secondary--text' : 'secondary'"
          ><!-- @click="routerPush('application-consumer')" -->
            {{ $t("pages.stepper.step2") }}
          </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          step="3"
          :complete="currentStep > 3 ? true : false"
          :color="currentStep == 3 ? 'yellow secondary--text' : 'secondary'"
        >
          {{ $t("pages.stepper.step3") }}
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step 
          step="4"
          :complete="currentStep > 4 ? true : false"
          :color="currentStep == 4 ? 'yellow secondary--text' : 'secondary'"
        >
          {{ $t("pages.stepper.step4") }}
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step 
          step="5"
          :complete="currentStep > 5 ? true : false"
          :color="currentStep == 5 ? 'yellow secondary--text' : 'secondary'"
        >
          {{ $t("pages.stepper.step5") }}
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step 
          step="6"
          :complete="currentStep > 6 ? true : false"
          :color="currentStep == 6 ? 'yellow secondary--text' : 'secondary'"
        >
          {{ $t("pages.stepper.step6") }}
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "a-stepper",
  props: {
    currentStep: {
      type: Number,
      required: false,
      default: () => 1,
    },
  },
  data: () => ({}),
  methods: {
    routerPush(name) {
      var id = localStorage.getItem("id") ?? null;

      if(id == null || id == undefined) return;
      router.push({
        name: name,
        params: { id: id },
      })
      .catch(()=>{
        console.log(name);
      });
    }
  }
};
</script>

<template>
  <v-footer app dark>
    <v-spacer></v-spacer>
    <div class="">
      <span class="caption blue-grey--text">
        &copy; {{ new Date().getFullYear() }}
        <img src="/img/app/p_16.png" />
      </span>
    </div>
  </v-footer>
</template>
<script>
export default {
  name: "a-footer",
  data: () => ({})
};
</script>

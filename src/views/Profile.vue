<template>
  <div>
    <div class="page-title">
      <h3>{{ "ProfileTitle" | localize }}</h3>
    </div>

    <form class="form" @submit.prevent="onSubmit">
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="name"
          :class="{ invalid: $v.name.$dirty && !$v.name.required }"
        />
        <label for="description">{{ "ProfileName" | localize }}</label>
        <small
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
        >
          {{ "ErrorNotEmpty" | localize }}
        </small>
      </div>
      <button class="btn waves-effect waves-light" type="submit">
        {{ "ButtonRefresh" | localize }}
        <i class="material-icons right">send</i>
      </button>
      <div class="switch">
        <label>
          English
          <input
            type="checkbox"
            v-model="isRuLocale"
            @change="changeLanguage"
          />
          <span class="lever"></span>
          Русский
        </label>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
export default {
  metaInfo() {
    return {
      title: this.$title("ProfileTitle")
    };
  },
  data: () => ({
    name: "",
    isRuLocale: true
  }),
  validations: {
    name: { required }
  },
  methods: {
    ...mapActions(["updateInfo"]),
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.updateInfo({
          name: this.name
        });
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async changeLanguage() {
      this.loading = true;
      try {
        await this.updateInfo({
          locale: this.isRuLocale ? "ru-RU" : "en-US"
        });
        // eslint-disable-next-line no-empty
      } catch (e) {}
      this.loading = false;
    }
  },
  mounted() {
    this.name = this.info.name;
    this.isRuLocale = this.info.locale === "ru-RU";
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      M.updateTextFields();
    });
  },
  computed: {
    ...mapGetters(["info"])
  }
};
</script>

<style scoped>
.switch {
  margin-top: 2rem;
}
</style>

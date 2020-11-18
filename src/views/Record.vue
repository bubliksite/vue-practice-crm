<template>
  <div>
    <div class="page-title">
      <h3>{{ "MenuAddNewRecord" | localize }}</h3>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      {{ "YouHaveNoRecords" | localize }}
      <router-link to="/categories">
        {{ "Add" | localize }}
      </router-link>
      {{ "OneMore" | localize }}
    </p>

    <form class="form" v-else @submit.prevent="addRecord">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.title }}
          </option>
        </select>
        <label>{{ "SelectCategory" | localize }}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{ "Income" | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{ "Outcome" | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{
            invalid:
              $v.amount.$dirty && (!$v.amount.minValue || !$v.amount.required)
          }"
        />
        <label for="amount">{{ "Amount" | localize }}</label>
        <span
          class="helper-text invalid"
          v-if="
            $v.amount.$dirty && (!$v.amount.minValue || !$v.amount.required)
          "
        >
          {{ "MinimalValue" | localize }} {{ $v.amount.$params.minValue.min }}
        </span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: $v.description.$dirty && !$v.description.required
          }"
        />
        <label for="description">{{ "Description" | localize }}</label>
        <span
          class="helper-text invalid"
          v-if="$v.description.$dirty && !$v.description.required"
        >
          {{ "ErrorNotEmpty" | localize }}
        </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ "ButtonCreate" | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { minValue, required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
export default {
  name: "Record",
  metaInfo() {
    return {
      title: this.$title("MenuAddNewRecord")
    };
  },
  data: () => ({
    loading: true,
    select: null,
    categories: [],
    category: null,
    type: "outcome",
    amount: 0,
    description: ""
  }),
  validations: {
    amount: { minValue: minValue(0.01), required },
    description: { required }
  },
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;
    if (this.categories.length) {
      this.category = this.categories[0].id;
    }
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      this.select = M.FormSelect.init(this.$refs.select);
      // eslint-disable-next-line no-undef
      M.updateTextFields();
    });
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }

      return this.info.bill >= this.amount;
    }
  },
  methods: {
    async addRecord() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch("addRecord", {
            categoryID: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          });
          const bill =
            this.type === "income"
              ? this.info.bill + this.amount
              : this.info.bill - this.amount;

          await this.$store.dispatch("updateInfo", { bill });
          this.$message("Новая запись добавлена");
          this.$v.$reset();
          this.amount = 0;
          this.description = "";
          // eslint-disable-next-line no-empty
        } catch (e) {}
      } else {
        this.$message(
          `Недостаточно средств (-${this.amount - this.info.bill})`
        );
      }
    }
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  }
};
</script>

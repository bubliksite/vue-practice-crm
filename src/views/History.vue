<template>
  <div>
    <div class="page-title">
      <h3>{{ "MenuHistory" | localize }}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <loader v-if="loading" />

    <p class="center" v-else-if="!records.length">
      {{ "YouHaveNoRecords" | localize }}
      <router-link to="/categories">
        {{ "Add" | localize }}
      </router-link>
      {{ "OneMore" | localize }}
    </p>

    <section v-else>
      <HistoryTable :records="items" />
      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Back' | localize"
        :next-text="'Forward' | localize"
        :container-class="'pagination center'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/HistoryTable";
import paginationMixin from "@/mixins/pagination.mixin";
import localizeFilter from "../filters/localize.filter";
import { Pie } from "vue-chartjs";
export default {
  metaInfo() {
    return {
      title: this.$title("MenuHistory")
    };
  },
  name: "history",
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted() {
    this.records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");
    this.setup(categories);
    this.loading = false;
  },
  methods: {
    setup(categories) {
      this.setupPagination(
        (this.records = this.records.map(record => {
          return {
            ...record,
            categoryName: categories.find(c => c.id === record.categoryID)
              .title,
            typeClass: record.type === "income" ? "green" : "red",
            typeText:
              record.type === "income"
                ? localizeFilter("Income")
                : localizeFilter("Outcome")
          };
        }))
      );
      this.renderChart({
        labels: categories.map(c => c.title),
        datasets: [
          {
            label: "Расходы по категориям",
            data: categories.map(c => {
              return this.records.reduce((total, r) => {
                if (r.categoryID === c.id && r.type === "outcome") {
                  total += +r.amount;
                }
                return total;
              }, 0);
            }),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      });
    }
  },
  components: {
    HistoryTable
  }
};
</script>

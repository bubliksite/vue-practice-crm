<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">{{ "Course" | localize }}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>{{ "Currency" | localize }}</th>
              <th>{{ "Course" | localize }}</th>
              <th>{{ "Date" | localize }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="cur in currencies" :key="cur">
              <td>{{ cur }}</td>
              <td>{{ changeCurrency(cur).toFixed(2) }} ₽</td>
              <td>{{ date | date("date") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["rates", "date"],
  data: () => ({
    currencies: ["EUR", "USD", "UAH"]
  }),
  methods: {
    changeCurrency(currency) {
      return 1 / (this.rates[currency] / this.rates["RUB"]);
    }
  }
};
</script>

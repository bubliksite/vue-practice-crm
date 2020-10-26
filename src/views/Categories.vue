<template>
  <div>
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <section>
      <div class="row">
        <CategoryAdd @created="addNewCategory" />
        <CategoryEdit />
      </div>
    </section>
  </div>
</template>

<script>
import CategoryAdd from "../components/CategoryAdd";
import CategoryEdit from "../components/CategoryEdit";
export default {
  name: "Categories",
  components: { CategoryEdit, CategoryAdd },
  data: () => ({
    categories: []
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category);
      console.log(this.categories);
    }
  }
};
</script>

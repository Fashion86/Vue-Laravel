<template>
  <!--<cube-spin></cube-spin>-->
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card class="card-plain">
            <template slot="header">
              <h4 class="card-title">Projects</h4>
              <button type="button" class="btn btn-outline-primary magin-top" @click="onNewDialog()">Add New Project</button>
            </template>
            <div class="table-responsive">
              <l-table class="table-hover"
                       :columns="tableColumns"
                       :data="projects">
              </l-table>
            </div>
          </card>
        </div>

      </div>
    </div>
    <modal name="project-modal" transition="pop-out" :width="400" height="auto">
      <div class="container-fluid">
        <h5>Add New Project</h5>
        <form @submit.stop.prevent="onSubmit">
          <div class="">
            <label :class="{ 'hasError': $v.form.name.$error }">name:</label>
            <input type="text" v-model="form.name" style="width: 100%">
          </div>
          <div class="btnGroup">
            <button type="button" class="btn btn-outline-secondary pull-right" @click="onCancel()">Cancel</button>
            <button type="submit" class="btn btn-outline-primary pull-right" @click="onNewDialog()">Submit</button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>
<script>

  import { mapGetters } from "vuex";
  import { required } from 'vuelidate/lib/validators'
  import LTable from '../../../components/UIComponents/Table.vue'
  import Card from '../../../components/UIComponents/Cards/Card.vue'
  // import CubeSpin from 'vue-loading-spinner/components/Cube'

  export default {
    components: {
      LTable,
      Card
    },
    computed: {
      ...mapGetters({
        projects: "projectStore/projects"
      })
    },
    data () {
      return {
        form: {
          name: null,
        },
        tableColumns: ['Id', 'Name']
      }
    },
    validations: {
      form: {
        name: {
          required
        }
      }
    },
    methods: {
      onNewDialog() {
        this.$modal.show('project-modal');
        },
      onCancel() {
        this.$modal.hide('project-modal');
      },
      onSubmit() {
        this.$v.form.$touch();
        if(this.$v.form.$error) return;
        this.$store
            .dispatch("projectStore/createProject", {
              name: this.form.name
            })
            .then(msg => {
            })
            .catch(e => console.log(e));
        this.$modal.hide('project-modal');
      }
    },
    created() {
      this.$store
          .dispatch("projectStore/getProjectsFromApi")
          .then(msg => {
          })
          .catch(e => console.log(e));
    }
  }
</script>
<style lang='scss'>
  .magin-top {
    margin-top: 10px;
  }
  .container-fluid {
    padding: 20px;
  }
  .btnGroup {
    padding: 10px;
    button {
      margin-left: 3px;
      margin-bottom: 10px;
    }
  }
  .hasError {
    color: red;
  }
</style>

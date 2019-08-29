<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <card>
            <div class=''>
              <!--<b-btn variant="success" @click="toggleWeekends" size="sm">toggle weekends</b-btn>-->
              <!--<button @click="gotoPast">go to a date in the past</button>-->
              <FullCalendar
                  class='book-calendar'
                  ref="fullCalendar"
                  defaultView="dayGridMonth"
                  themeSystem="bootstrap"
                  :header="{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridYear'
                }"
                  :plugins="calendarPlugins"
                  :weekends="calendarWeekends"
                  :editable="true"
                  :height="600"
                  :events="events"
                  @dateClick="handleDateClick"
                  @eventResize="handleResize"
                  @eventDrop="handleDrop"
                  @eventClick="handleEventClick"
                  @eventRender="eventRender"
              />
            </div>
          </card>
          <modal name="event-modal" transition="pop-out" :width="400" height="auto">
              <form @submit.prevent="onSubmit">
                <div class="box box-part">
                    <label class="event-title">Add an event</label>
                    <input type="text" v-model="form.title" @blur="$v.form.title.$touch()" style="width: 100%">
                  <span style="color: red" v-if="$v.form.title.$error">Title is required</span>
                </div>
                <div class="box box-content">
                  <label class="event-title">Project: </label>
                  <select v-model="form.project" class="select" data-dropup-auto="false"
                          data-size="10">
                    <option v-for="project in projects" v-bind:value="project.id">{{project.name}}</option>
                  </select>
                  <span style="color: red" v-if="$v.form.project.$error">Project is required</span>
                </div>
                <div class="box" v-if="!mutiday">
                  <div class="box-content">
                    <span>When?</span>
                    <div class="flex-column">
                      <input type="date" class="dateinput" v-model="form.start_date" style="width: 60%">
                      <span style="width: 10%">
                        at
                      </span>
                      <select v-model="form.start_time" class="select" data-dropup-auto="false"
                              data-size="10" style="width: 30%;">
                        <option v-for="time in times">{{time}}</option>
                      </select>
                    </div>
                    <span style="color: red" v-if="$v.form.start_date.$error">Start date is required</span>
                  </div>
                  <div>
                    <a class="multi-event" @click="onMulti(true)"><span>Make this a multi-day event</span></a>
                  </div>
                </div>

                <div class="box" v-if="mutiday">
                  <div class="flexdiv">
                    <span>Starts</span>
                    <div>
                      <input type="date" class="dateinput" v-model="form.start_date">
                      <span style="color: red" v-if="$v.form.start_date.$error">Start date is required</span>
                    </div>
                  </div>
                  <div class="flexdiv">
                    <span>Ends</span>
                    <div>
                      <input type="date" class="dateinput" v-model="form.end_date">
                    </div>
                  </div>
                  <div class="flexdiv">
                    <span></span>
                    <a class="multi-event" @click="onMulti(false)"><span>Make this a one-day event</span></a>
                  </div>
                </div>

                <div class="box" style="padding-bottom: 0">
                    <div class="flex-column">
                      <span>This is </span>
                      <label class="radio-inline"><input type="radio" name="optradio" v-model="form.type" value="event" @click="onEventType(true)"> an event</label>
                      <label class="radio-inline"><input type="radio" name="optradio" v-model="form.type" value="milestone" @click="onEventType(false)"> a milestone</label>
                    </div>
                    <span style="font-size: 12px">Milestones have checkboxes that let you mark them as done. They can be late, too.</span>
                </div>

                <div class="box" v-if="!eventType" style="padding-bottom: 0">
                  <div style="display: grid">
                    <span>Who's responsible?</span>
                    <select v-model="form.user" class="select" data-dropup-auto="false"
                            data-size="10" style="width: 30%;">
                      <option v-for="user in users" v-bind:value="user.id">{{user.name}}</option>
                    </select>
                  </div>
                  <!--<span style="font-size: 12px">It will send an email reminder 48 hours before the milestone is due.</span>-->
                </div>

                <div style="padding: 2px 20px">
                  <hr style="border-top: dotted 1px;" />
                </div>
                <div class="box" style="padding-top: 0; display: flex; justify-content: space-between">
                  <div class="flexdiv">
                    <button class="addbtn" type="submit" >
                      <span v-if="!editEvent">Add this event</span>
                      <span v-if="editEvent">Save changes</span>
                    </button>
                    <span style="padding: 0 10px; width: 30px;">
                        or
                      </span>
                      <a class="cancelbtn" @click="onCancel()"><span>Cancel</span></a>
                  </div>
                  <div class="flexdiv">
                    <a v-if="editEvent" class="pull-right" @click="ondelete()"><span>Remove</span></a>
                  </div>
                </div>

              </form>
          </modal>
        </div>

      </div>
    </div>
  </div>
</template>
<script>

  import { mapGetters } from "vuex";
  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import bootstrapPlugin from '@fullcalendar/bootstrap'
  import Card from '../../../components/UIComponents/Cards/Card.vue'
  import PRadio from "../../UIComponents/Inputs/Radio";
  import { required } from 'vuelidate/lib/validators'
  const MODAL_WIDTH = 656

  export default {
    components: {
      PRadio,
      FullCalendar,
      Card
    },
    computed: {
      ...mapGetters({
        projects: "projectStore/projects",
        users: "userStore/users",
        events: "eventStore/events",
        userID: "userID"
      })
    },
    validations: {
      form: {
        title: {
          required
        },
        start_date: {
          required
        },
        project: {
          required
        }
      }
    },
    data: function() {
      return {
        calendarPlugins: [
          dayGridPlugin,
          timeGridPlugin,
          bootstrapPlugin,
          interactionPlugin// needed for dateClick
        ],
        modalWidth: MODAL_WIDTH,
        calendarWeekends: true,
        dialogTilte: "New Event",
        editEvent: null,
        moveEvent: null,
        mutiday: false,
        eventType: false,
        form: {
          title: null,
          start_date: "",
          end_date: null,
          start_time: "",
          end_time: null,
          project: null,
          user: null,
          type: "event"
        },
        times: ["12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM",
          "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM", "6:00 AM", "6:30 AM",
          "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
          "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
          "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
          "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM",
          "11:00 PM", "11:30 PM"]
      }
    },
    methods: {
      toggleWeekends() {
        this.calendarWeekends = !this.calendarWeekends // update a property
      },
      gotoEvent(event) {
        const date_time = new Date(event.start);
        const date = date_time.getFullYear() + '-' + ("0" + (date_time.getMonth() + 1)).slice(-2) + '-' + ("0" + date_time.getDate()).slice(-2);
        let calendarApi = this.$refs.fullCalendar.getApi();
        calendarApi.gotoDate(date) // goto map event month
      },
      onMulti(flag) {
        this.mutiday = flag;
      },
      onCancel() {
        this.$modal.hide('event-modal');
      },
      onEventType(type) {
        this.eventType = type;
        if (this.eventType) {
          this.form.type = "event";
        } else {
          this.form.type = "milestone";
        }
      },
      ondelete() {
        if (confirm("Are you sure you want to delete this event?")) {
          this.$store
              .dispatch("eventStore/removeEvent", this.editEvent.id)
              .then(msg => {
                console.log(msg);
                this.$modal.hide('event-modal');
              })
              .catch(e => {
                this.$modal.hide('event-modal');
              });
        }
      },

      convertTime(isoDate) {
        const date_time = new Date(isoDate);
        const date = date_time.getFullYear() + '-' + ("0" + (date_time.getMonth() + 1)).slice(-2) + '-' + ("0" + date_time.getDate()).slice(-2);
        const time = date_time.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
        return {date: date, time: time}
      },
      handleDateClick(arg) {
        this.mutiday = false;
        this.editEvent = null;
        this.eventType = true;
        const start_date = new Date(arg.dateStr);
        this.form.start_date = arg.dateStr;
        this.form.end_date = arg.dateStr;
        this.form.start_time = "9:00 AM";
        this.form.user = this.userID;
        this.form.title = null;
        this.form.type = "event";
        this.form.project = null;
        this.$modal.show('event-modal');
      },
      handleEventClick(arg) {

        const editEvent = this.events.find(e => e.id === parseInt(arg.event.id));
        this.editEvent = editEvent;
        if (arg.jsEvent.srcElement.type === "checkbox") {
          console.log('dddd', arg.jsEvent.target.checked)
          return;
        }

        const start_date = this.convertTime(arg.event.start).date;
        const start_time = this.convertTime(arg.event.start).time;
        const end_date = this.convertTime(arg.event.end).date;
        const end_time = this.convertTime(arg.event.end).time;

        this.form.start_date = start_date;
        this.form.start_time = start_time;
        this.form.end_date = end_date;
        this.form.end_time = end_time;
        this.form.title = editEvent.title;
        this.form.type = editEvent.type;
        this.form.user = editEvent.user_id;
        this.form.project = editEvent.project_id;
        this.eventType = true;
        if (editEvent.type === "milestone") {
          this.eventType = false;
        }
        this.$modal.show('event-modal');
      },
      handleResize(arg) {
        console.log('resize', arg)
      },
      handleDrop(arg) {
      },
      eventRender(event, element, view ) {console.log('dddd', this.events)
        let checkEvent = this.events.find(e=> e.id === parseInt(event.event.id));
        if (checkEvent.type === "milestone") {
          checkEvent.backgroundColor = "green";
          let answer = document.createElement('input');
          answer.setAttribute('type', 'checkbox');
          answer.setAttribute('id',   'answer');
          answer.setAttribute('checked',   'true');
          event.el.getElementsByClassName("fc-content")[0].insertBefore(answer, event.el.getElementsByClassName("fc-content")[0].firstChild);
        }


      },
      onSubmit() {
        this.$v.form.$touch();
        if(this.$v.form.$error) return

        let start = new Date(this.form.start_date + ' ' + this.form.start_time).toISOString();
        let end = null;
        if (this.mutiday) {
          start = new Date(this.form.start_date).toISOString();
          end = new Date(this.form.end_date).toISOString();
        } else {
          start = new Date(this.form.start_date + ' ' + this.form.start_time).toISOString();
          end = null;
        }

        let event_data = {
          title: this.form.title,
          type: this.form.type,
          start: start,
          end: end,
          user_id: this.form.user,
          project_id: this.form.project
        };

        this.$store
            .dispatch("eventStore/createEvent", event_data)
            .then(msg => {
              console.log(msg);
              this.$modal.hide('event-modal');
            })
            .catch(e => {
              console.error('ddd', e);
              this.$modal.hide('event-modal');
            });
      }
    },
    created () {
      this.$store
          .dispatch("projectStore/getProjectsFromApi")
          .then(msg => {

          })
          .catch(e => console.log(e));
      this.$store
          .dispatch("eventStore/getEventsFromApi")
          .then(msg => {

          })
          .catch(e => console.log(e));
      this.$store
          .dispatch("userStore/getUsersFromApi")
          .then(msg => {
          })
          .catch(e => console.log(e));
    }
  }
</script>
<style lang="scss">
  .box {
    padding: 0 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    .dateinput {
      height: 30px;
      -webkit-appearance: push-button !important;
    }
    select {
      height: 30px;
    }
  }
  .box-part {
    background-color: #f3f3f3;
    padding: 20px;
  }
  .event-title {
    font-weight: 500;
  }
  .box-content {
    display: grid;
  }
  .multi-event {
    span {
      color: #0e0be8;
      font-size: 12px;
      text-decoration: underline;
    }
  }
  .multi-event:hover {
    cursor: pointer;
    background-color: #0e0be8;
    span {
      color: #fff;
    }
  }
  .cancelbtn {
    height: 20px;
    padding: 0 0;
    span {
      color: #ff1826;
      font-size: 14px;
      text-decoration: underline;
    }
  }
  .cancelbtn:hover {
    cursor: pointer;
    background-color: #ff1826;
    span {
      color: #fff;
    }
  }
  .flexdiv {
    display: flex;
    padding-bottom: 5px;
    span {
      width: 30%;
    }
  }
  .radio-inline {
    margin-left: 8px;
  }
  .addbtn {
    font-size: 14px;
    height: 30px;
  }
  .hasError {
    border-color: red;
  }
</style>

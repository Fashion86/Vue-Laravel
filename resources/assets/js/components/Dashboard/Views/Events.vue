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
                  right: 'dayGridYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                }"
                  :plugins="calendarPlugins"
                  :weekends="calendarWeekends"
                  :editable="true"
              />
            </div>
          </card>
        </div>

      </div>
    </div>
  </div>
</template>
<script>

  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import bootstrapPlugin from '@fullcalendar/bootstrap'
  import Card from '../../../components/UIComponents/Cards/Card.vue'

  export default {
    components: {
      FullCalendar,
      Card
    },
    data: function() {
      return {
        calendarPlugins: [
          dayGridPlugin,
          timeGridPlugin,
          bootstrapPlugin,
          interactionPlugin// needed for dateClick
        ],
        calendarWeekends: true,
        dialogTilte: "New Event",
        editEvent: null,
        moveEvent: null,
        form: {
          title: "",
          start_date: "",
          end_date: "",
          start_time: "",
          end_time: "",
          description: null,
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
  }
</script>
<style>

</style>

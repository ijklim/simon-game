Vue.component('game-pad', {
  template: `
    <v-card class="white elevation-10 game-pad">
      <v-container grid-list-lg>
        <v-layout wrap>
          <v-flex xs6 v-for="button in buttons" :key="button.id">
            <game-buttons :baseUrl="baseUrl" :color="button.color"></game-buttons>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  `,
  data () {
    return {
      buttons: gameButtons
    }
  },
  props: {
    baseURL: {
      type: String,
      default: ''
    }
  }
});
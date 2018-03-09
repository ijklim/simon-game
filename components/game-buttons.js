const gameButtons = [
  { color: 'green', sound: '' },
  { color: 'red', sound: '' },
  { color: 'yellow', sound: '' },
  { color: 'blue', sound: '' },
];

Vue.component('game-buttons', {
  template: `
    <v-btn
      block
      class="game-button elevation-5"
      :class="color"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
      &nbsp;
    </v-btn>
  `,
  data () {
    return {
      mouseDownInterval: ''
    }
  },
  props: {
    baseURL: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  },
  methods: {
    onMouseDown () {
      let soundFile = `${baseURL}assets/sound/sound-${this.color}.mp3`;
      this.mouseDownInterval = 'down';
      console.log('todo: mouse is', this.mouseDownInterval)
    },
    onMouseUp () {
      this.$emit('button-clicked', this.color);
      console.log('todo: mouse was', this.mouseDownInterval)
      this.mouseDownInterval = 'up';
      console.log('todo: mouse is', this.mouseDownInterval)
    }
  }
});
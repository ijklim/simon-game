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
      oscillatorNode: false
    }
  },
  props: {
    audioCtx: {
      type: AudioContext,
      default: {}
    },
    color: {
      type: String,
      default: ''
    },
    soundFrequency: {
      type: Number,
      default: 200
    }
  },
  methods: {
    onMouseDown () {
      if (!this.audioCtx) return;

      this.oscillatorNode = this.audioCtx.createOscillator();
      this.oscillatorNode.type = "sine";
      this.oscillatorNode.frequency.setValueAtTime(this.soundFrequency, this.audioCtx.currentTime);
      this.oscillatorNode.connect(this.audioCtx.destination);
      
      this.oscillatorNode.start();
    },
    onMouseUp () {
      this.oscillatorNode.stop();
      this.$emit('button-clicked', this.color);
    }
  },
  mounted () {
    
  }
});
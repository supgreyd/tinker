<template>
  <div>
    <v-layer>
      <v-rect ref="swing" :config="swingConfig" />
      <v-rect ref="rect" @keydown="handleMove" :config="rectConfig" />
      <v-regular-polygon @click="rotate(30)" :config="triangleConfig" />
    </v-layer>
  </div>
</template>

<script>
  export default {
    name: 'Swing',

    data() {
      return {
        rectConfig: {
          fill: "green",
          height: 40,
          width: 40,
          y: 0,
          x: 0,
        },

        swingConfig: {
          fill: "red",
          height: 10,
          width: 300,
          y: 455,
          x: 160,
          rotation: 0,
          offset: {
            x: 150,
            y: 5,
          },
        },

        triangleConfig: {
          x: 160,
          y: 485,
          sides: 3,
          height: 30,
          width: 50,
          fill: '#00D2FF',
        }

      }
    },

    methods: {

      rotate(deg) {
        const degToRad = Math.PI / 180
        let node = this.swingConfig


        const rotatePoint = ({x, y}, deg) => {
          const rcos = Math.cos(deg * degToRad), rsin = Math.sin(deg * degToRad)
          return {x: x*rcos - y*rsin, y: y*rcos + x*rsin}
        }

        const topLeft = {x:-node.width / 2, y:-node.height / 2}

        const current = rotatePoint(topLeft, node.rotation)
        const rotated = rotatePoint(topLeft, deg)
        const dx = rotated.x - current.x, dy = rotated.y - current.y

        console.log({dx})
        console.log({dy})

        node.rotation = deg
        node.x = node.x + dx
        node.y = node.y + dy

      },

      handleMove(e) {
        console.log({e})
      }

    },

    mounted() {
      let angularSpeed = 90;

      let swing = this.$refs.swing.getNode()
      let box = this.$refs.rect.getNode()

      var tween = new Konva.Tween({
        node: swing,
        duration: 1,
        rotation: 10
      });

      var tween2 = new Konva.Tween({
        node: box,
        duration: 5,
        y: 465
      });

      tween2.play()
      //
      // setTimeout(() => {
      //   tween.reverse()
      // }, 2000)
      //
      // setTimeout(() => {
      //   tween.play()
      // }, 4000)


      // let anim = new Konva.Animation(function (frame) {
      //   let angleDiff = (frame.timeDiff * angularSpeed) / 1000;
      //
      //   console.log({frame})
      //
      //   swing.rotate(angleDiff);
      // }, swing.getLayer());
      //
      // anim.start();
    }

  }
</script>
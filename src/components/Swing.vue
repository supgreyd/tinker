<template>
    <v-layer ref="layer">

      <v-group ref="group" :config="groupConfig">
        <v-rect ref="swing" :config="swingConfig" />
      </v-group>

      <v-regular-polygon :config="triangleConfig" />

      <v-label ref="actionBtn" @click="startGame"/>

    </v-layer>
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
          y: 0,
          x: 0,
        },

        triangleConfig: {
          x: 160,
          y: 485,
          sides: 3,
          height: 30,
          width: 50,
          fill: '#00D2FF',
        },

        actionBtnConfig: {
          x: 20,
          y: 500,
        },

        groupConfig: {
          y: 455,
          x: 160,
          rotation: 0,
          offset: {
            x: 150,
            y: 5,
          },
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

        node.rotation = deg
        node.x = node.x + dx
        node.y = node.y + dy

      },

      handleMove(e) {
        console.log({e})
      },

      generateButton(node) {
        node.add(new Konva.Tag({
          fill: 'black',
          lineJoin: 'round',
          shadowColor: 'black',
          shadowBlur: 10,
          shadowOffset: 10,
          shadowOpacity: 0.5
        }));

        node.add(new Konva.Text({
          text: 'Start',
          fontFamily: 'Calibri',
          fontSize: 18,
          padding: 5,
          fill: 'white'
        }));
      },

      generateRect() {
        // add new rect to layer, we remove it after adding it to swing group
        const layer = this.$refs.layer.getNode()

        let rect = new Konva.Rect({
          fill: "green",
          height: 40,
          width: 40,
          y: 0,
          x: 0,
          id: 'rect'
        })

        layer.add(rect)
        layer.draw()

        return rect
      },

      addNodeToSwingGroup(node) {
        const swingGroup = this.$refs.group.getNode()
        const layer = this.$refs.layer.getNode()

        layer.find('#rect').remove()
        layer.draw()

        this.$nextTick(() => {
          node.y(0)
          swingGroup.add(node)
          swingGroup.draw()
        })

      },

      startGame() {
        let box = this.generateRect()

        this.dropBox(box)
      },

      dropBox(node) {
        const dropDuration = 2
        let swing = this.$refs.swing.getNode()
        let swingPosition = swing.getClientRect()

        node.to({
          duration: dropDuration,
          y: swingPosition.y - node.height()
        })

        setTimeout(() => {
          this.addNodeToSwingGroup(node)
        }, dropDuration * 1000)

        // this.rotateSwing()

      },

      rotateSwing() {
        const swing = this.$refs.group.getNode()

        let tween = new Konva.Tween({
          node: swing,
          duration: 1,
          rotation: -10
        });

        tween.play()

      }

    },

    mounted() {

      let angularSpeed = 90;

      let swing = this.$refs.swing.getNode()
      // let box = this.$refs.rect.getNode()
      let actionBtn = this.$refs.actionBtn.getNode()

      this.generateButton(actionBtn)



      // var tween2 = new Konva.Tween({
      //   node: box,
      //   duration: 5,
      //   y: 465
      // });
      //
      // tween2.play()
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
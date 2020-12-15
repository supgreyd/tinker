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
        swingGroup: null,
        swing: null,
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
          height: 455,
          offset: {
            x: 150,
            y: 5,
          },
        }

      }
    },

    methods: {

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
        const group = this.$refs.group.getNode()

        let rect = new Konva.Rect({
          fill: "green",
          height: 40,
          width: 40,
          y: 0,
          x: 0,
          id:  'rect1'
          // id: group.getChildren().length
        })

        layer.add(rect)
        layer.draw()

        return rect
      },

      addNodeToSwingGroup(node) {
        //action when collision happens
        const swingGroup = this.$refs.group.getNode()
        const layer = this.$refs.layer.getNode()

        let rect = new Konva.Rect({
          fill: node.fill(),
          height: node.height(),
          width: node.width(),
          y: 0 - node.height(),
          x: node.x() - 10,
          id: 'rect1'
        })

        layer.find(`#${node.attrs.id}`).destroy()
        layer.draw()
        swingGroup.add(rect)
        swingGroup.draw()

        this.rotateSwing()

      },

      startGame() {
        let box = this.generateRect()
        let opositBox = this.dropOpositeRect()
        let DROP_SPEED = 1

        document.addEventListener('keydown', this.logKey)

        let swing = this.$refs.group.getNode()

        let refreshIntervalId = setInterval(() => {
          DROP_SPEED *= 1.1
          box.y(box.y() + DROP_SPEED)
          opositBox.y(opositBox.y() + DROP_SPEED)
          this.$refs.layer.getNode().draw()


          if (box.y() + box.height() >= swing.y() - 5) {
            clearInterval(refreshIntervalId);
            this.addNodeToSwingGroup(box)
            this.addNodeToSwingGroup(opositBox)
          }
        }, 100)

      },

      logKey(e, rect = this.$refs.layer.getNode().find('#rect1')[0]) {
        //handle drop

        const MOVE_SPEED = 5

        //arrow right down
        if (e.keyCode === 39 && rect.x() <= this.swing.width()/2 - rect.width()) {
          rect.x(rect.x() + MOVE_SPEED)
        }
        //arrow left
        if (e.keyCode === 37 && rect.x() > 0) {
          rect.x(rect.x() - MOVE_SPEED)
        }

      },

      rotateSwing() {
        const swing = this.$refs.group.getNode()

        let tween = new Konva.Tween({
          node: swing,
          duration: 1,
          rotation: -10
        });

        tween.play()

      },

      dropOpositeRect() {
        const layer = this.$refs.layer.getNode()
        const swing = this.$refs.swing.getNode()

        const group = this.$refs.group.getNode()

        let rect = new Konva.Rect({
          fill: "yellow",
          height: 40,
          width: 40,
          y: 0,
          x: this.randomInt(swing.width() / 2, swing.width() - 40),
          id: 'rect2'
          // id: group.getChildren().length
        })

        layer.add(rect)
        layer.draw()

        return rect
      },

      randomInt(min, max) {
        return min + Math.floor((max - min) * Math.random());
      }

    },

    mounted() {
      this.swingGroup = this.$refs.group.getNode()
      this.swing = this.$refs.swing.getNode()
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
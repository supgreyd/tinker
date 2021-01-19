<template>
    <v-layer ref="screenLayer" :config="layerConfig">

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

    // TODO 1. сделать главный экран для запуска игры w = 60% h = 80%
    // 2. функционал перезапуска игры
    // 3. пауза
    // 4. создать различные шейпы
    // 5. разбить на компоненты
    // 6. добавить условие победы / проиграша

    data() {
      return {
        rounds: 3,
        currentRound: 1,
        leftSideShapes: [],
        rightSideShapes: [],
        swingGroup: null,
        swing: null,

        screenLayer: null,

        layerConfig: {
          width: 600,
          y: 50
        },

        swingConfig: {
          fill: "red",
          height: 10,
          width: 600,
          y: 0,
          x: 0,
        },

        triangleConfig: {
          x: 310,
          y: 605,
          sides: 3,
          height: 60,
          width: 100,
          fill: '#00D2FF',
        },

        actionBtnConfig: {
          x: 20,
          y: 500,
        },

        groupConfig: {
          y: 555,
          x: 310,
          rotation: 0,
          height: 455,
          offset: {
            x: 300,
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

      //TODO generate any shape
      generateRect() {
        // add new rect to layer, we remove it after adding it to swing group
        const layer = this.$refs.screenLayer.getNode()
        const group = this.$refs.group.getNode()

        let rect = new Konva.Rect({
          fill: "green",
          height: 40,
          width: 40,
          y: 0,
          x: this.swing.width() / 4,
          id:  'leftSideShape',
          stroke: 'black',
          strokeWidth: 1
        })

        layer.add(rect)
        layer.draw()

        return rect
      },

      addNodeToSwingGroup(node) {
        //action when collision happens
        const swingGroup = this.$refs.group.getNode()
        const layer = this.$refs.screenLayer.getNode()

        let rect = new Konva.Rect({
          fill: node.fill(),
          height: node.height(),
          width: node.width(),
          y: 0 - node.height(),
          x: node.x() - 10,
          id: swingGroup.getChildren().length,
          stroke: 'black',
          strokeWidth: 1
        })

        layer.find(`#${node.attrs.id}`).destroy()
        layer.draw()
        swingGroup.add(rect)
        swingGroup.draw()

        if (node.id() === 'leftSideShape') {
          this.leftSideShapes.push({
            position: rect.x() + rect.width() / 2,
            weight: 10
          })
        }

        if (node.id() === 'rightSideShape') {
          this.rightSideShapes.push({
            position: rect.x() + rect.width() / 2,
            weight: 10
          })

          this.countSwingDegree()

        }

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
          this.$refs.screenLayer.getNode().draw()


          if (box.y() + box.height() >= swing.y() - 5) {
            clearInterval(refreshIntervalId);
            this.addNodeToSwingGroup(box)
            this.addNodeToSwingGroup(opositBox)
          }
        }, 100)

      },

      logKey(e, rect = this.$refs.screenLayer.getNode().find('#leftSideShape')[0]) {
        //handle drop

        const MOVE_SPEED = 10

        //arrow right down
        if (e.keyCode === 39 && rect.x() <= this.swing.width()/2 - rect.width()) {
          rect.x(rect.x() + MOVE_SPEED)
        }
        //arrow left
        if (e.keyCode === 37 && rect.x() > 0) {
          rect.x(rect.x() - MOVE_SPEED)
        }

      },

      rotateSwing(deg) {
        const swing = this.$refs.group.getNode()

        let tween = new Konva.Tween({
          node: swing,
          duration: 1,
          rotation: deg
        });

        tween.play()

      },

      dropOpositeRect() {
        const layer = this.$refs.screenLayer.getNode()
        const swing = this.$refs.swing.getNode()

        const group = this.$refs.group.getNode()

        let rect = new Konva.Rect({
          fill: "yellow",
          height: 40,
          width: 40,
          y: 0,
          x: this.randomInt(swing.width() / 2, swing.width() - 40),
          id: 'rightSideShape',
          stroke: 'black',
          strokeWidth: 1
        })

        layer.add(rect)
        layer.draw()

        return rect
      },

      randomInt(min, max) {
        return min + Math.floor((max - min) * Math.random());
      },

      countSwingDegree() {
        let F1 = 0, F2 = 0, l1 = 0, l2 = 0
        const g = 9.81
        const CENTER_POINT = this.swing.width() / 2

        this.leftSideShapes.forEach(shape => {
          F1 += (shape.weight * g)
          l1 += shape.position
        })

        this.rightSideShapes.forEach(shape => {
          F2 += (shape.weight * g)
          l2 += (this.swing.width() - shape.position)
        })

        this.rotateSwing(this.getSwingDegree((F1 * l1), (F2 * l2)))

        this.currentRound++
        this.currentRound <= this.rounds ? this.startGame() : null

      },

      getSwingDegree(a, b) {
        const deg = 100 * (((a - b) / b).toFixed(2))
        return deg
      }

    },

    mounted() {
      this.swingGroup = this.$refs.group.getNode()
      this.swing = this.$refs.swing.getNode()
      let actionBtn = this.$refs.actionBtn.getNode()

      this.screenLayer = this.$refs.screenLayer.getNode()
      this.screenLayer.x(300)
      // this.screenLayer.height(this.screenLayer.parent.height())

      const HEIGHT = this.screenLayer.parent.height()

      // console.log({ HEIGHT })
      // this.screenLayer.height(HEIGHT)
      // this.screenLayer.draw()
      this.generateButton(actionBtn)

    }

  }
</script>
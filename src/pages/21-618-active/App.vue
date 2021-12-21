<template>
    <div>
        <div class="content">
            {{ aa }}--{{ rectiveObj.name }}
            <span>231</span>
        </div>
        <img src="~assets/event-loop.png" />
    </div>
</template>
<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue';

interface Person {
    name: string
    age: number
}
export default defineComponent({
  setup() {
    const aa = ref('456789');

    const obj: Person = {
      name: 'qweqweqw',
      age: 18,
    };
    const rectiveObj = reactive(obj);
    return {
      aa,
      rectiveObj,
    };
  },
});
</script>
<style lang="scss" scoped>
$color: red;
.content {
  color: $color;
  span {
    color: black;
  }
}
</style>

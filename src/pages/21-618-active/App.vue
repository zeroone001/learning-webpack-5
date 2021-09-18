<template>
    <div>
        <div class="content">
            {{ aa }}--{{ rectiveObj.name }}
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

    const q = () => {
      const aaa = '12312312312312';
      console.log(aaa);
    };
    q();
    return {
      aa,
      rectiveObj,
    };
  },
});
</script>
<style lang="scss" scoped>
.content {
  color: red;
}
</style>

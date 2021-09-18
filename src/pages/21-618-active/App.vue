<template>
    <div>
        <div class="content">
            {{ aa }}--{{ rectiveObj.name }}
        </div>
        <img src="~assets/event-loop.png" />
    </div>
</template>
<script lang='ts'>
interface Person {
    name: string,
    age: number
}
import { defineComponent, reactive, ref } from 'vue';
export default defineComponent({
    setup () {
        let aa = ref('123');

        let obj: Person = {
            name: 'eqweqwewq123',
            age: 18
        }
        let rectiveObj = reactive(obj);
        
        const q = () => {
            let aaa = '12312312312312';
            console.log(aaa);
        }
        q();
        return {
            aa,
            rectiveObj
        };
    }
});
</script>
<style lang="scss" scoped>
.content {
  color: red;
}
</style>
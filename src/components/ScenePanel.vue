<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-file-input @change="updateImg" accept="image/*" label="HDRI"></v-file-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-img v-bind:src="src" aspect-ratio="1.7"></v-img>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        src: "https://cdn.vuetifyjs.com/images/parallax/material2.jpg",
        file: null
    }),

    methods: {
        updateImg(file){
            var self = this;

            // We update the file only if there is at least one selected`
            if(file){
                var reader = new FileReader();

                reader.onload = function(e){
                    self.src = e.target.result;
                    self.file = e.target.result;
                }

                reader.readAsDataURL(file);
            }
        },
    }
}
</script>
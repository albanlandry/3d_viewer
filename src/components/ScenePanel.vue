<template>
    <v-container fluid>
        <v-file-input @change="updateImg" accept=".hdr,images/*" label="HDRI"></v-file-input>
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
            self.$emit('hdr-selected', file);
            /*
            // We update the file only if there is at least one selected`
            if(file){
                var reader = new FileReader();

                reader.onload = function(e){
                    self.src = e.target.result;
                    self.file = e.target.result;

                    // Inform about the file being uploaded
                    self.$emit('hdr-selected', self.file);
                }

                reader.readAsDataURL(file);
            }
            */
        },
    }
}
</script>
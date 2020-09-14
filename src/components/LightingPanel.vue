<style scoped>
    .container {
        max-width: 250px;
    }
</style>

<template>
    <!--
    <v-row>
        <v-col>
            <v-btn class="my-1" small tile outlined color="primary">
                <v-icon left>mdi-plus</v-icon> Add Light
            </v-btn>
        </v-col>
    </v-row>
    -->
    <v-row>
        <v-col>
            <v-menu
            v-model="menu"
            :close-on-content-click="false"
            offset-x
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn dark
                        v-bind="attrs"
                        v-on="on"
                        class="my-1" small tile outlined color="primary">
                        <v-icon left>mdi-plus</v-icon> Add Light
                    </v-btn>
                </template>

                <v-container my-0 max-width="100px">
                    <v-row>
                        <v-col cols="12" class="text-center">
                            <v-btn @click="addLight(0)" cols="3" class="ma-2" small rounded outlined color="success">
                                <v-icon left>mdi-plus</v-icon> POINT LIGHT
                            </v-btn>
                            <v-btn @click="addLight(1)" cols="3" class="ma-2" small rounded outlined color="success">
                                <v-icon left>mdi-plus</v-icon> DERECTIONAL LIGHT
                            </v-btn>
                            <v-btn @click="addLight(2)" cols="3" class="ma-2" small rounded outlined color="success">
                                <v-icon left>mdi-plus</v-icon> SPOTLIGHT
                            </v-btn>
                            <v-btn @click="addLight(3)"  cols="3" class="ma-2" small rounded outlined color="success">
                                <v-icon left>mdi-plus</v-icon> HEMISPHERE LIGHT
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-menu>
        </v-col>
    </v-row>
</template>

<script>
  export default {
    data: () => ({
      fav: true,
      menu: false,
      message: false,
      hints: true,
    }),

    methods: {
        addLight(id){
            this.$root.$emit("add-light", id);
            this.menu = false;
        },
    }
  }
</script>
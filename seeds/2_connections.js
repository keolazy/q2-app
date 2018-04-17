exports.seed = function(knex, Promise) {
  return knex("connections").insert([
    { user_id_owner: "2", user_id_friend: "4" , mutual:true},
    { user_id_owner: "4", user_id_friend: "2" , mutual:true},
    { user_id_owner: "1", user_id_friend: "3" , mutual:false},
    { user_id_owner: "1", user_id_friend: "6" , mutual:false},
    { user_id_owner: "3", user_id_friend: "8" , mutual:false},
    { user_id_owner: "2", user_id_friend: "4" , mutual:false},
    { user_id_owner: "7", user_id_friend: "8" , mutual:false}
  ]);
};

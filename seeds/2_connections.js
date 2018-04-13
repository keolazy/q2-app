exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("connections")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("connections").insert([
        { user_id_owner: "2", user_id_friend: "4" },
        { user_id_owner: "1", user_id_friend: "3" },
        { user_id_owner: "1", user_id_friend: "6" },
        { user_id_owner: "3", user_id_friend: "8" },
        { user_id_owner: "2", user_id_friend: "4" },
        { user_id_owner: "7", user_id_friend: "8" }
      ]);
    });
};

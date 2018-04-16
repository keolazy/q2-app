exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users_events")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users_events").insert([
        {
          user_id: 8,
          event_id: 1,
          questions:
            "1. So what is a blood feast? \
          2. Has anyone even seen a cannibal before? \
          3. What do people taste like?",
          topics:
            "I like sports, women, cars, \
          fire, pole-dancing, skydiving, bungie jumping \
          gambling, and crochet. ",
          job_status: "I'm currrently between jobs.",
          noise_level:
            " It'll be hard to hear over the \
          sound of all that chomping!",
          where_to_find:
            "you can find me right in the action \
          Ill probably have a bite myself!",
          ask_me: "Ask me about my weiner",
          personality:
            "I'm a deeply sensitive man. I don't like jokes \
          pointed directly at me, and I don\t understand sarcasm."
        },
        {
          user_id: 1,
          event_id: 2,
          questions:
            "1. Who in the fuck is Lupe Fiasco? \
          2. Oh he's that nigga that sang kick push \
          3. well I still don\t know who he is!",
          topics: "basket-weaving, carpentry, cigars, nascar, tennis",
          job_status: "I'm CEO bitch",
          noise_level: "I'll be in a quiet one on one conversation",
          where_to_find: "I'll probably be in the cemetary",
          ask_me:
            "ask me where I've been traveling, how much my house costs, \
          where I live, and who I'm seeing these days",
          personality: "I'm not a good person, but I've seen few repercussions."
        },
        {
          user_id: 4,
          event_id: 3,
          questions: "1. very nice, HOW MUCH?!",
          topics: "",
          job_status: "my sister is the 3rd best prostitute",
          noise_level: "",
          where_to_find: "america",
          ask_me: "sunbathing, ping-pong",
          personality: ""
        },
        {
          user_id: 4,
          event_id: 1,
          questions: "where are all the fine country boys hiding?",
          topics: "TV Show:Atlanta",
          job_status: "Intern at the Conan Show",
          noise_level: "screamer",
          where_to_find: "probably in a coat room or broom closet",
          ask_me: "don't ask just make a move",
          personality: "none"
        },
        {
          user_id: 5,
          event_id: 3,
          questions:
            "1. seriously, how much wood could a wood chuck chuck if \
          a wood chuck could chuck wood!?",
          topics: "astonomy, astrology",
          job_status: "CPA accountant at Price Waterhouse",
          noise_level:
            "Motorhead, My Bloody Valentine, Jesus and Mary Chain loud",
          where_to_find: "in the bathroom",
          ask_me: "about your taxes",
          personality:
            'nicest guy ever, just obsessed with the phrase "stack house"'
        },
        {
          user_id: 1,
          event_id: 4,
          questions: "are gay people attracted to themselves?",
          topics: "sushi, Memento",
          job_status: "struggling actor",
          noise_level: "either shouting or whisper",
          where_to_find: "the center of attention",
          ask_me: "about my acting technique, how I prepare for roles",
          personality: "expressive"
        }
      ]);
    });
};

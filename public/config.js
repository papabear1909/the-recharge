// THE RECHARGE: everything you may need to edit lives in this one file.
// Keep the quotes and commas as they are. Times always carry "+03:00" (Nairobi time).
// After editing, upload the site again. Open pages pick up the change on their next visit.

export default {
  event: {
    name: "The Recharge",
    subtitle: "Annual Conference",
    host: "Jesus Healing Centre Churches Kenya",
    hostPerson: "Bishop Migwi",
    theme: "Promoting Slaves to Sons",
    scripture: "Galatians 4:7",
    year: "2026",
  },

  // The charge level before the conference starts rises from this moment to the first session.
  chargeStart: "2026-11-23T00:00:00+03:00",

  // Nairobi has no daylight saving. Leave this as it is.
  timeZone: "Africa/Nairobi",
  utcOffset: "+03:00",

  // Five days, two sessions each. Change any time here and the whole site follows.
  // topic and speaker are hidden on the page while they are empty.
  days: [
    {
      date: "2026-12-02",
      sessions: [
        { id: "morning", start: "2026-12-02T10:00:00+03:00", end: "2026-12-02T13:00:00+03:00", topic: "", speaker: "" },
        { id: "evening", start: "2026-12-02T15:00:00+03:00", end: "2026-12-02T18:00:00+03:00", topic: "", speaker: "" },
      ],
    },
    {
      date: "2026-12-03",
      sessions: [
        { id: "morning", start: "2026-12-03T10:00:00+03:00", end: "2026-12-03T13:00:00+03:00", topic: "", speaker: "" },
        { id: "evening", start: "2026-12-03T15:00:00+03:00", end: "2026-12-03T18:00:00+03:00", topic: "", speaker: "" },
      ],
    },
    {
      date: "2026-12-04",
      sessions: [
        { id: "morning", start: "2026-12-04T10:00:00+03:00", end: "2026-12-04T13:00:00+03:00", topic: "", speaker: "" },
        { id: "evening", start: "2026-12-04T15:00:00+03:00", end: "2026-12-04T18:00:00+03:00", topic: "", speaker: "" },
      ],
    },
    {
      date: "2026-12-05",
      sessions: [
        { id: "morning", start: "2026-12-05T10:00:00+03:00", end: "2026-12-05T13:00:00+03:00", topic: "", speaker: "" },
        { id: "evening", start: "2026-12-05T15:00:00+03:00", end: "2026-12-05T18:00:00+03:00", topic: "", speaker: "" },
      ],
    },
    {
      // Sunday: assumed to follow the same times. Change here if it differs.
      date: "2026-12-06",
      sessions: [
        { id: "morning", start: "2026-12-06T10:00:00+03:00", end: "2026-12-06T13:00:00+03:00", topic: "", speaker: "" },
        { id: "evening", start: "2026-12-06T15:00:00+03:00", end: "2026-12-06T18:00:00+03:00", topic: "", speaker: "" },
      ],
    },
  ],

  venue: {
    address: "300m opposite V.p.p Shah Stores, Pop In, Kerugoya town, Kenya",
    landmark: "V.p.p Shah Stores",
    placeName: "Jesus Healing Centre Church Headquarters",
    mapUrl: "https://www.google.com/maps/place/Jesus+Healing+Centre+Church+Headquarters/data=!4m2!3m1!1s0x0:0x29a17d93d224dacd?sa=X&ved=1t:2428&ictx=111",
    // PLACEHOLDER: exact coordinates, for example "-0.4989, 37.2803". Hidden while empty.
    coordinates: "",
    // PLACEHOLDER: short notes. Each line is hidden while empty.
    parking: "",
    accommodation: "",
  },

  contact: {
    phoneDisplay: "0723 545 922",
    phoneIntl: "+254723545922",
  },

  social: {
    youtube: "https://youtube.com/@jesushealingcentrechurchke5930",
    tiktok: "https://www.tiktok.com/@migwi_evangelism",
  },

  // PLACEHOLDER: paste the live-stream link here (for example a YouTube live link).
  // While empty, no live button is shown.
  livestreamUrl: "",

  // PLACEHOLDER: a short notice for last-minute changes, shown in a red band at the top.
  // One text per language. Leave all three empty to hide it.
  notice: { en: "", sw: "", ki: "" },

  // Speakers in the order they appear. Names and titles come from here, never from the artwork.
  // still / video: paths inside the site. Leave "" if you do not have the file yet:
  // no still shows a monogram of the initials, no video shows the still only.
  // crop: which part of the photo stays in view if a frame ever has a different shape (x% y%).
  speakers: [
    {
      id: "bishop-migwi", title: "Bishop", name: "Migwi", role: "host",
      still: "assets/speakers/bishop-migwi-591.webp",
      stillSmall: "assets/speakers/bishop-migwi-296.webp",
      avif: true,
      video: "assets/video/bishop-migwi.mp4", videoWebm: "",
      crop: "50% 50%",
    },
    {
      id: "pastor-muinde", title: "Pastor", name: "Muinde", role: "",
      still: "assets/speakers/pastor-muinde-591.webp",
      stillSmall: "assets/speakers/pastor-muinde-296.webp",
      avif: true,
      video: "assets/video/pastor-muinde.mp4", videoWebm: "",
      crop: "50% 50%",
    },
    {
      id: "reverend-kiseli", title: "Reverend", name: "Kiseli", role: "",
      still: "assets/speakers/reverend-kiseli-591.webp",
      stillSmall: "assets/speakers/reverend-kiseli-296.webp",
      avif: true,
      video: "assets/video/reverend-kiseli.mp4", videoWebm: "",
      crop: "50% 50%",
    },
    {
      id: "bishop-gibson", title: "Bishop", name: "Gibson", role: "",
      still: "assets/speakers/bishop-gibson-591.webp",
      stillSmall: "assets/speakers/bishop-gibson-296.webp",
      avif: true,
      video: "assets/video/bishop-gibson.mp4", videoWebm: "",
      crop: "50% 50%",
    },
    {
      id: "apostle-makosi", title: "Apostle", name: "Makosi", role: "",
      still: "assets/speakers/apostle-makosi-591.webp",
      stillSmall: "assets/speakers/apostle-makosi-296.webp",
      avif: true,
      video: "assets/video/apostle-makosi.mp4", videoWebm: "",
      crop: "50% 50%",
    },
    {
      id: "pastor-chege", title: "Pastor", name: "Chege", role: "",
      still: "assets/speakers/pastor-chege-591.webp",
      stillSmall: "assets/speakers/pastor-chege-296.webp",
      avif: true,
      video: "assets/video/pastor-chege.mp4", videoWebm: "",
      crop: "50% 50%",
    },
  ],
};

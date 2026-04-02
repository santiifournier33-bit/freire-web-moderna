fetch('https://tokkobroker.com/api/v1/property/?key=1dc0ef58a932195a5ae942f23063314ac8f34ffc&limit=5&lang=es_ar')
  .then(r => r.json())
  .then(d => {
    console.log(JSON.stringify(d.objects.map(o => ({
      id: o.id,
      video_url: o.video_url,
      videos: o.videos,
      virtual_tour: o.virtual_tour 
    })), null, 2));
  });

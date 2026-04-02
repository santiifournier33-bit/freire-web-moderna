const KEY = "1dc0ef58a932195a5ae942f23063314ac8f34ffc";

async function test() {
  try {
    const res = await fetch(`https://tokkobroker.com/api/v1/property/?key=${KEY}&limit=2`);
    const data = await res.json();
    console.log("List status:", res.status);
    
    if (data.objects && data.objects.length > 0) {
      const propId = data.objects[0].id;
      console.log("First Prop ID:", propId);
      console.log("Operations:", JSON.stringify(data.objects[0].operations, null, 2));
      
      const detailRes = await fetch(`https://tokkobroker.com/api/v1/property/${propId}/?key=${KEY}`);
      console.log("Detail status:", detailRes.status);
      const detailData = await detailRes.json();
      console.log("Detail Title:", detailData.publication_title);
    }
  } catch(e) {
    console.error(e);
  }
}
test();

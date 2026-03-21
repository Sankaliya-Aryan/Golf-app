async function run() {
  try {
    let token;
    let res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "tmp@test.com", password: "password" })
    });
    if(!res.ok) {
       res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: "Test1", email: "tmp@test.com", password: "password" })
       });
    }
    const data = await res.json();
    token = data.token;
    console.log("Auth token acquired");

    res = await fetch('http://localhost:5000/api/users/subscribe', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
       body: JSON.stringify({ plan: 'monthly' })
    });
    const subText = await res.text();
    console.log("Subscribed raw:", subText);

    res = await fetch('http://localhost:5000/api/users/subscription', {
       headers: { Authorization: `Bearer ${token}` },
    });
    const statText= await res.text();
    console.log("Status raw:", statText);

    res = await fetch('http://localhost:5000/api/scores', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
       body: JSON.stringify({ score: 12 })
    });
    console.log("Score added raw:", await res.text());
  } catch(e) { console.error(e); }
}
run();

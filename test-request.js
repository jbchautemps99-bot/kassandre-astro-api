const response = await fetch('http://localhost:3000/api/kassandre-profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Jean-Baptiste',
    birthDate: '1999-07-12',
    birthTime: '14:35',
    birthPlace: 'Paris, France'
  })
});

console.log(await response.json());

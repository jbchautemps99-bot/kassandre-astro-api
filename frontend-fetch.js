export async function getKassandreProfile(formValues) {
  const response = await fetch('http://localhost:3000/api/kassandre-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'x-api-key': 'change-me' // uniquement si API_KEY est défini dans .env
    },
    body: JSON.stringify({
      firstName: formValues.firstName,
      birthDate: formValues.birthDate,
      birthTime: formValues.birthTime,
      birthPlace: formValues.birthPlace
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Erreur API KASSANDRE');
  }

  return response.json();
}

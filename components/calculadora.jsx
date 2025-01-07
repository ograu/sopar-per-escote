function calcularRepartiment(pagaments) {
    // Calculem el total pagat i el cost mitjà per persona
    const totalPagat = pagaments.reduce((sum, p) => sum + p.import, 0);
    const costMitja = totalPagat / pagaments.length;

    // Convertim a una llista de quantitats ajustades (positives o negatives)
    const ajustos = pagaments.map((p) => ({
        persona: p.persona,
        ajust: p.import - costMitja
    }));

    // Separem deutors (-) i creditors (+)
    const deutors = ajustos.filter((a) => a.ajust < 0).map((a) => ({ ...a, ajust: -a.ajust }));
    const creditors = ajustos.filter((a) => a.ajust > 0);

    const transaccions = [];

    let i = 0; // Index per a deutors
    let j = 0; // Index per a creditors

    // Resolem les transaccions per equilibrar els ajustos
    while (i < deutors.length && j < creditors.length) {
        const deutor = deutors[i];
        const creditor = creditors[j];

        // Determinem l'import que es pot transferir
        const quantitat = Math.min(deutor.ajust, creditor.ajust);

        // Guardem la transacció
        transaccions.push({
            de: deutor.persona,
            a: creditor.persona,
            import: quantitat
        });

        // Actualitzem els ajustos restants
        deutor.ajust -= quantitat;
        creditor.ajust -= quantitat;

        // Eliminem persones completades (ajust = 0)
        if (deutor.ajust === 0) i++;
        if (creditor.ajust === 0) j++;
    }

    return { transaccions, costMitja };
}

// Exemple d'ús:
const pagaments = [
    // { persona: 'Jordi', import: 18.79 },
    // { persona: 'Oriol', import: 41 },
    // { persona: 'Sandra', import: 49.89 },
    // { persona: 'Carmina', import: 58.87 },
    // { persona: 'Nele', import: 14.35 },
    // { persona: 'Jaz', import: 0 },
    // { persona: 'Fernando', import: 0 },
    // { persona: 'Tania', import: 0 },
    // { persona: 'Alberto', import: 0 },
    // { persona: 'Paco', import: 0 },
    // { persona: 'Jose', import: 0 },
    // { persona: 'Sheila', import: 0 },
    // { persona: 'Vanesa', import: 0 },
    // { persona: 'Miguel', import: 0 },
    // { persona: 'Maria', import: 0 }
    { persona: 'Manuel', import: 30 },
    { persona: 'Javi', import: 10 },
    { persona: 'Marta', import: 20 }
];

const resultat = calcularRepartiment(pagaments);

export function Calculadora() {
    return (
        <>
            <div className="bg-white card text-neutral-600">
                <div className="card-body flex flex-row gap-4">
                    <div>Nom</div>
                    <div>Import</div>
                </div>
                <div className="card-body flex flex-row gap-4">
                    <input className="border-black border rounded" type="text" name="nom" />
                    <input className="border-black border rounded" type="number" name="import" />
                    <button>Afegir</button>
                    <button>Esborrar</button>
                </div>
            </div>
            <div className="bg-white card text-neutral-600">
                <div className="card-body">
                    <h3>Paganinis: </h3>
                    <ul>
                        {pagaments
                            .filter((p) => p.import > 0)
                            .map((p) => (
                                <li>
                                    {p.persona}: {p.import.toFixed(2)}€
                                </li>
                            ))}
                    </ul>
                    <h3>Cost mitjà per persona: 👉 {resultat.costMitja} 👈</h3>
                    <h3>Bizums</h3>
                    <ul>
                        {resultat.transaccions.map((t) => (
                            <li>
                                {t.de} ha de pagar {t.import.toFixed(2)}€ a {t.a}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

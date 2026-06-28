interface Props {
    titulo: string;
    descricao: string;
}

export default function StatisticCard({
    titulo,
    descricao,
}: Props) {
    return (
        <div className="card">
            <h3>{titulo}</h3>
            <p>{descricao}</p>
        </div>
    );
}
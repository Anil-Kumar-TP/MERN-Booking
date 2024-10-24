type Props = {
    selectedPrice?: number;
    onChange: (value?: number) => void;
}

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
    return (
        <div>
            <h4 className="text-md font-semibold mb-2">Max Price</h4>
            <select value={selectedPrice} onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : undefined)} className="p-2 border rounded-md w-full">
                <option value="">Select Max Price</option>
                {[200, 400, 600, 800, 1000].map((price) => (
                    <option value={price}>{price}</option>
                ))}
            </select>
        </div>
    );
};

export default PriceFilter;
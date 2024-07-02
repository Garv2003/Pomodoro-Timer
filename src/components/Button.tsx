type ButtonProps = {
    selectType: (type: string) => void;
    type: () => string;
    name: string;
    small?: boolean;
}

const Button = (props: ButtonProps) => {
    return (
        <button
            class="hover:bg-white hover:text-black text-3xl font-bold py-2 px-4 rounded-2xl"
            onClick={() => props.selectType(props.name)}
            classList={{
                "bg-white text-black":
                    props.type() === props.name,
                "text-white border border-white":
                    props.type() !== props.name,
                "text-xl": props.small,
            }}
        >
            {props.name}
        </button>
    );
};

export default Button;
function Button({ text, onClick, icon, className = "" }) {
    return (
        <div
            onClick={onClick}
            className={className}
        >
            {icon && <span>{icon}</span>} {text && <span>{text}</span>}
        </div>
    );
}

export default Button;
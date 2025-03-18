export function UploadButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className="w-full py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
    )
}
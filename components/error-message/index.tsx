import React from 'react';
import '@/styles/error-message-styles.css'
import { ErrorMessageProps } from "@/utils/interfaces/component-props";

/**
 * Clean error message with fade in properties, to be displayed directly under SearchBar for invalid city requests.
 */

const ErrorMessage: React.FC<ErrorMessageProps> = ({ showError, errorMessage, handleCloseError }) => {
    return (
        <main className='relative z-10'>
            {showError && (
                <div className={`error-message ${!showError ? 'hide' : ''}`}>
                    {errorMessage}
                    <button onClick={handleCloseError} className="float-right">✕</button>
                </div>
            )}
        </main>
    )
}

export default ErrorMessage;
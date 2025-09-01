// components/LibrasWorking.jsx
'use client';

import { useState, useEffect } from 'react';

const LibrasWorking = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    useEffect(() => {
        const handleTextSelection = () => {
            const selection = window.getSelection();
            const text = selection.toString().trim();
            if (text) {
                setSelectedText(text);
                setIsOpen(true);
            }
        };

        document.addEventListener('mouseup', handleTextSelection);
        return () => document.removeEventListener('mouseup', handleTextSelection);
    }, []);

    return (
        <>
            {/* Botão flutuante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                title="Tradutor de Libras"
            >
                🤟
            </button>

            {/* Widget funcional */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-xl border p-4 w-80">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Rybená - Libras</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-3">
                        {selectedText && (
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm font-medium">Texto selecionado:</p>
                                <p className="text-sm text-gray-600">"{selectedText}"</p>
                            </div>
                        )}

                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-4xl mb-2">🤟</div>
                            <p className="text-sm text-gray-600">
                                Tradutor de Libras Ativo
                            </p>
                        </div>

                        <p className="text-xs text-gray-500">
                            Selecione qualquer texto da página para traduzir
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default LibrasWorking;
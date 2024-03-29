import React from 'react';
import { WordContainer } from './WordContainer';
import { VariableContainer } from './VariableContainer';

const SentenceParser = ({ sentence }) => {
    // Regular expression to match variables including the brackets and type
    const variableRegex = /\[.*?:(.*?)\]/g;

    // Function to parse the sentence and return an array of components
    const parseSentence = (sentence) => {
        const elements = [];
        let lastIndex = 0;


        // Find each variable in the sentence
        sentence.match(variableRegex)?.forEach((match, index) => {
            const matchStart = sentence.indexOf(match, lastIndex);
            const matchEnd = matchStart + match.length;

            // Push preceding words (if any) as WordContainer components
            if (matchStart > lastIndex) {
                const words = sentence.slice(lastIndex, matchStart).trim();
                words.split(' ').forEach((word) => {
                    if (word) elements.push(<WordContainer key={`word-${elements.length}`}>{word}</WordContainer>);
                });
            }

            // Remove brackets and split the variable from the type
            const variableContent = match.slice(1, -1);
            const [variableName, variableType] = variableContent.split(':').map((s) => s.trim());

            // Push the variable as a VariableContainer component
            elements.push(
                <VariableContainer key={`variable-${index}`} type={variableType}>
                    {variableName}
                </VariableContainer>
            );

            // Update lastIndex to the end of the current match
            lastIndex = matchEnd;
        });

        // Push any remaining words after the last variable
        const remainingWords = sentence.slice(lastIndex).trim();
        if (remainingWords) {
            remainingWords.split(' ').forEach((word) => {
                if (word) elements.push(<WordContainer key={`word-${elements.length}`}>{word}</WordContainer>);
            });
        }

        return elements;
    };

    return <div>{parseSentence(sentence)}</div>;
};

export default SentenceParser;

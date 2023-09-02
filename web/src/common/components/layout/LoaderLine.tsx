import styled, { keyframes } from 'styled-components';

const lineAnim = keyframes`
    0% {
        left: -40%;
    }
    50% {
        left: 20%;
        width: 40%;
    }
    100% {
        left: 100%;
        width: 80%;
    }
`;

const LoaderContainerDiv = styled.div`
    width: 100%;
    height: 2px;
    overflow: hidden;
    background-color: #ddd;
    position: relative;
    overflow: none;
`;

const LoaderLineDiv = styled.div`
    content: '';
    position: absolute;
    left: -50%;
    height: 100%;
    width: 20%;
    background-color: #eee;
    animation: ${lineAnim} 1s linear infinite;
    border-radius: 20px;
`;

const LoaderLine = () => {
    return (
        <LoaderContainerDiv>
            <LoaderLineDiv />
        </LoaderContainerDiv>
    );
};

export default LoaderLine;

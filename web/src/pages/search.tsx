import BasicHead from "common/components/layout/BasicHead";
import Layout from "common/components/layout/Layout";
import SearchResults from "features/Search/SearchResults";

function SearchPage() {
    return (
        <>
            <BasicHead title="goSolve | Search" />
            <Layout>
                <SearchResults/>
            </Layout>
        </>
    );
}

export default SearchPage;

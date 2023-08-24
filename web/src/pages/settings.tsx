import BasicHead from "common/components/layout/BasicHead";
import Layout from "common/components/layout/Layout";
import AccountSettings from "features/AccountSettings";

function SettingsPage() {
    return (
        <>
            <BasicHead title="goSolve | Account settings" />
            <Layout>
                <AccountSettings />
            </Layout>
        </>
    );
}

export default SettingsPage;

import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {LoginPage} from './pages/LoginPage'
import {RegisterPage} from './pages/RegisterPage'
import {MainPage} from './pages/MainPage'
import {ProfilePage} from './pages/ProfilePage'
import {CollectionPage} from './pages/CollectionPage'
import {UsersPage} from './pages/UsersPage'
import {ItemPage} from './pages/ItemPage'
import {ChangeItemPage} from './pages/ChangeItemPage'
import {AllCollectionsPage} from './pages/AllCollectionsPage'
import {SearchResultPage} from './pages/SearchResultPage'

export const useRoutes = (userRole, isAuthenticated) => {
        return (
            <Switch>
                {/* {!isAuthenticated && <> */}
                <Route path="/login" exact>
                    <LoginPage />
                </Route>
            <Route path="/register" exact>
                    <RegisterPage />
                </Route>
                 {/* </> } */}
            <Route path="/" exact>
                    <MainPage />
                </Route>
            <Route path="/all_collections" exact>
                    <AllCollectionsPage />
                </Route>
            <Route path="/search_result/:id" exact>
                    <SearchResultPage />
                </Route>
            {isAuthenticated && <Route path="/profile/:id" exact>
                    <ProfilePage />
                </Route> }
            <Route path="/collection/:id" exact>
                    <CollectionPage />
                </Route>
            <Route path="/item/:id" exact>
                    <ItemPage />
                </Route>
            <Route path="/change_item/:id" exact>
                    <ChangeItemPage />
                </Route>    
            {userRole === 'admin' && <Route path="/users" exact>
                    <UsersPage />
                </Route>}
            <Redirect to="/" />
            </Switch>
        )
}
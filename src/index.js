import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Recipe extends React.Component{
    constructor(props){
        super();
        this.state = {
            name : props.value.singleRecipeName,
            ingredients : props.value.singleRecipeIngredients,
            indexKeyIngredients : 0,
            recipeIndex : props.value.recipeIndex,
            cacheName : props.value.singleRecipeName,
            cacheIngredients : props.value.singleRecipeIngredients
        };
    }

    deleteRecipe(){
        console.log(this.props);
        this.props.deleteRecipe(this.state.recipeIndex);
    }

    handleSubmit(event){

        if(this.state.cacheIngredients.indexOf(',') > -1){
            this.setState({
                name : this.state.cacheName,
                ingredients : this.state.cacheIngredients.split(",")
            });
        }
        else{
            this.setState({
                name : this.state.cacheName,
                ingredients : [this.state.cacheIngredients]
            });
        }
        
    }

    handleChangeRecipeName(event){
        this.setState({
            cacheName : event.target.value
        });
    }

    handleChangeRecipeIngredients(event){
        this.setState({
            cacheIngredients : event.target.value
        });
    }

    handleReopen(event){
        this.setState({
            cacheName : this.state.name,
            cachedRecipesIngredients : this.state.ingredients
        });
    }

    render(){
        return(
            <li className="list-group-item">
                <span>
                    <p className="container-fluid d-flex align-items-center">
                        <a className="btn btn-primary" data-toggle="collapse" href={"#" + "collapse" + this.state.recipeIndex} aria-expanded="false" aria-controls="collapse">
                            {this.state.name}
                        </a>
                    </p>
                    <div className="collapse" id={"collapse" + this.state.recipeIndex}>
                        <div className="card card-block">
                            <ul>
                                {this.state.ingredients.map((element) => {
                                                                            this.state.indexKeyIngredients = this.state.indexKeyIngredients + 1;
                                                                            return (<li key={this.state.indexKeyIngredients}>{element}</li>)
                                                                            }
                                                            )
                                } 
                            </ul>
                        </div>
                        <span className="d-flex align-items-beginning">
                            <button type="button" className="btn btn-danger" onClick={this.deleteRecipe.bind(this)}>Delete</button>
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target={"#modal" + this.state.recipeIndex} onClick={this.handleReopen.bind(this)}>Edit</button>

                            <div className="modal fade" id={"modal" + this.state.recipeIndex} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel"><input id={this.state.name} type="text" key="recipe" value={this.state.cacheName} onChange={this.handleChangeRecipeName.bind(this)}/> </h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <textarea type="text" key={this.state.ingredients} value={this.state.cacheIngredients} onChange={this.handleChangeRecipeIngredients.bind(this)}/>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" data-dismiss="modal" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Submit edit</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </div>
                </span>
            </li>
        );
    };
 
}


class Recipes extends React.Component{

    constructor(props){
        super();
        this.state = {
            objectRecipes : props.value
        };
    }

    render(){
        return (
            <div className="jumbotron text-center">
                <div>
                    <ul className="list-group">
                        <li className="list-group-item">
                            <span>
                                <p className="container-fluid">
                                    <a className="btn btn-primary" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                        Spagetthi Bolognese (Examplerecipe)
                                    </a>
                                </p>
                                <div className="collapse" id="collapseExample">
                                    <div className="card card-block">
                                        <ul>
                                             <li key="{exampleRecipe1}">350 g Faschiertes Fleisch</li>
                                             <li key="{exampleRecipe2}">75 g Speck (in Scheiben)</li>
                                             <li key="{exampleRecipe13}">800 g Tomaten (Stücke, aus der Dose)</li>
                                             <li key="{exampleRecipe16}">500 g Spaghetti</li>
                                        </ul>
                                    </div>
                                </div>   
                            </span>
                        </li>
                        {this.state.objectRecipes}
                        
                    </ul>
                </div>
            </div>
        );
    }
}


class Recipebox extends React.Component{

    constructor(){
        super();

        this.state = {
            objectRecipes : [],
            recipe : [],
            indexRecipe : 0
        }

       const cachedRecipesIngredientss = localStorage.getItem("_recipeIngredientss");
       const cachedRecipeNames = localStorage.getItem("_recipeNames");
       
      

        if (cachedRecipesIngredientss && cachedRecipeNames) {
            this.refillRecipeBook(cachedRecipesIngredientss, cachedRecipeNames);
        }

    }

    deleteRecipe(delObjectIndex){
        this.state.objectRecipes[delObjectIndex] = "";
        this.setState({
            objectRecipes : this.state.objectRecipes
        });

        this.cacheRecipes();
    }

    refillRecipeBook(cachedRecipesIngredientss, cachedRecipeNames){

        let helperArray = cachedRecipesIngredientss.split(",");
        let separatedIngredientsArrays = [];
        let ingredientsArrayIndex = 0;
        let endOfLastIngredientsRecipeArray = 0;
        let cachedRecipeNamesSplit = cachedRecipeNames.split(",");

        helperArray.forEach(function(element, index, array) {
            if(index !== 0 && array[index - 1] === "" && element === ""){
                separatedIngredientsArrays[ingredientsArrayIndex] = helperArray.slice(endOfLastIngredientsRecipeArray, index - 1);
                endOfLastIngredientsRecipeArray = index + 1;
                ingredientsArrayIndex++;
            }
        }, this);

        let recipesObject = [];

        cachedRecipeNamesSplit.forEach(function(element, index) {
            recipesObject.push({
                singleRecipeName : element,
                singleRecipeIngredients : separatedIngredientsArrays[index],
                recipeIndex : index
            });
        }, this);

        let helperArraySecond = [];
        cachedRecipeNamesSplit.forEach(function(element, index) {
            helperArraySecond.push(<Recipe key={cachedRecipeNamesSplit[index] + index + ""} 
                                           value={recipesObject[index]} 
                                           deleteRecipe={this.deleteRecipe.bind(this)} 
                                           handleSubmit={this.handleSubmit.bind(this)}
                                           />);
        }, this);

        this.state.indexRecipe = Number(cachedRecipeNamesSplit.length);
        this.state.objectRecipes = helperArraySecond;

        

    }

    cacheRecipes(){
        let cacheArrayIngredientss = [];
        let cacheArrayNames = [];

        this.state.objectRecipes.forEach(function(element) {
            if(element !== ""){
                cacheArrayIngredientss.push(element.props.value.singleRecipeIngredients);
                cacheArrayIngredientss.push(",");
                cacheArrayNames.push(element.props.value.singleRecipeName);
            }
        }, this);

        localStorage.setItem('_recipeIngredientss', cacheArrayIngredientss); 
        localStorage.setItem('_recipeNames', cacheArrayNames)

    }

    handleSubmit(event){
        event.preventDefault();
        let helperArray = this.state.objectRecipes;

        let recipeObject = {
            singleRecipeName : this.state.recipe.singleRecipeName,
            singleRecipeIngredients : this.state.recipe.singleRecipeIngredients,
            recipeIndex : this.state.indexRecipe 
        };

        helperArray.push(<Recipe key={this.state.recipe.singleRecipeName + this.state.indexRecipe + ""} 
                                 value={recipeObject}  
                                 deleteRecipe={this.deleteRecipe.bind(this)}
                                 handleSubmit={this.handleSubmit.bind(this)}
                                 />);

        this.setState({
            indexRecipe : Number(this.state.indexRecipe) + 1
        });

        this.setState({
            objectRecipes : helperArray
        });

        this.setState({
            recipe : {
                singleRecipeIngredients : "",
                singleRecipeName : ""
            }
        });

        this.cacheRecipes();
    }

    handleChangeRecipeName(event){
        this.setState({
            recipe : {
                singleRecipeIngredients : this.state.recipe.singleRecipeIngredients,
                singleRecipeName : event.target.value
            }
        });
    }

    handleChangeRecipeIngredients(event){
        this.setState({
            recipe : {
                singleRecipeIngredients : event.target.value.split(","),
                singleRecipeName : this.state.recipe.singleRecipeName
            }
        });
    }


    render(){
        return (
            <div className="webpage container">
                    <Recipes key="recipeMultiple" value={this.state.objectRecipes}/>

                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#myModal">
                        Add a recipe
                    </button>

                    <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel"><input id="recipeName" type="text" key="recipe" placeholder="Enter your recipes name..." value={this.state.recipe.singleRecipeName} onChange={this.handleChangeRecipeName.bind(this)}/> </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <textarea type="text" key="ingredients" placeholder="Enter your recipes ingredients..." value={this.state.recipe.singleRecipeIngredients} onChange={this.handleChangeRecipeIngredients.bind(this)}/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Submit recipe</button>
                            </div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Recipebox />,
    document.getElementById('root')
);
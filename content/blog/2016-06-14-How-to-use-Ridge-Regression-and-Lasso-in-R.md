
## How to use Ridge Regression and Lasso in R

<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> <small style="color:gray">Jun 14, 2016</small><br/>
<span class="glyphicon glyphicon-user" aria-hidden="true"></span> <small style="color:gray">Ricardo Carvalho</small><br/>

---

In a very simple and direct way, after a brief introduction of the methods, we will see how to run Ridge Regression and Lasso using R!

---

### Ridge Regression in R

Ridge Regression is a regularization method that tries to avoid overfitting, penalizing large coefficients through the L2 Norm. For this reason, it is also called L2 Regularization.

In a linear regression, in practice it means we are minimizing the RSS (Residual Sum of Squares) added to the L2 Norm. Thus, we seek to minimize:

$RSS(\beta) + \lambda \sum_{j=1}^{p} \beta_j^2$

where $\lambda$ is the tuning parameter, $\beta_j$ are the estimated coefficients, existing $p$ of them.

To perform Ridge Regression in R, we will use the glmnet package, developed by the creators of the algorithm.

```r
require(glmnet)
# Data = considering that we have a data frame named dataF, with its first column being the class
x <- as.matrix(dataF[,-1]) # Removes class
y <- as.double(as.matrix(dataF[, 1])) # Only class

# Fitting the model (Ridge: Alpha = 0)
set.seed(999)
cv.ridge <- cv.glmnet(x, y, family='binomial', alpha=0, parallel=TRUE, standardize=TRUE, type.measure='auc')

# Results
plot(cv.ridge)
cv.ridge$lambda.min
cv.ridge$lambda.1se
coef(cv.ridge, s=cv.ridge$lambda.min)
```

testando

```python
for i in range(1, 10):
  print(str(i+1))

def nova_fun(aaa):
  return(aaa+1)

nova_fun(1)

x = 1 + y
```

In the above code, we execute logistic regression (note the family='binomial'), in parallel (if a cluster or cores have been previously allocated), internally standardizing (needed for more appropriate regularization) and wanting to observe the results of AUC (area under ROC curve). Moreover, the method already performs 10-fold cross validation to choose the best $\lambda$.

At the end, there are some useful commands to verify the results, like plots of the AUC results and values of minimum $\lambda$ (for minimum AUC) and 1 std. error (for AUC lower than minimum by one standard deviation).

---

### Lasso in R

Now let's move to the Lasso! Lasso is also a regularization method that tries to avoid overfitting penalizing large coefficients, but it uses the L1 Norm. For this reason, it is also called L1 Regularization.

This method has as great advantage the fact that it can shrink some of the coefficients to exactly zero, performing thus a selection of attributes with the regularization.

In a linear regression, in practice for the Lasso, it means we are minimizing the RSS (Residual Sum of Squares) added to the L1 Norm. Thus, we seek to minimize:

$RSS(\beta) + \lambda \sum_{j=1}^{p} |\beta_j|$

where $\lambda$ is the tuning parameter, $\beta_j$ are the estimated coefficients, existing $p$ of them.

To perform Lasso in R, we will use the glmnet package, developed by the creators of the algorithm.

```r
require(glmnet)
# Data = considering that we have a data frame named dataF, with its first column being the class
x <- as.matrix(dataF[,-1]) # Removes class
y <- as.double(as.matrix(dataF[, 1])) # Only class

# Fitting the model (Lasso: Alpha = 1)
set.seed(999)
cv.lasso <- cv.glmnet(x, y, family='binomial', alpha=1, parallel=TRUE, standardize=TRUE, type.measure='auc')

# Results
plot(cv.lasso)
plot(cv.lasso$glmnet.fit, xvar="lambda", label=TRUE)
cv.lasso$lambda.min
cv.lasso$lambda.1se
coef(cv.lasso, s=cv.lasso$lambda.min)
```

In the above code, we execute logistic regression (note the family='binomial'), in parallel (if a cluster or cores have been previously allocated), internally standardizing (needed for more appropriate regularization) and wanting to observe the results of AUC (area under ROC curve). Moreover, the method already performs 10-fold cross validation to choose the best $\lambda$.

At the end, there are some useful commands to verify the results, like plots of the AUC results and values of minimum $\lambda$ (for minimum AUC) and 1 std. error (for AUC lower than minimum by one standard deviation).

---

Since this post is already long, in another post I will talk about the Adaptive Lasso, an evolution of the Lasso seeking to satisfy the Oracle property.


That's it, I hope it's enough!

Any questions, suggestions: feel free to comment!

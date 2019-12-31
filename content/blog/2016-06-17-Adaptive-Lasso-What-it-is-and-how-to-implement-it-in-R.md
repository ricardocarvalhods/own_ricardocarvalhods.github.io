### Adaptive Lasso: What it is and how to implement in R"

<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> <small style="color:gray">Jun 17, 2016</small><br/>
<span class="glyphicon glyphicon-user" aria-hidden="true"></span> <small style="color:gray">Ricardo Carvalho</small><br/>

---

Adaptive Lasso is an evolution of the Lasso. Let's see briefly how it improves Lasso and show the code needed to run it in R!

Lasso was introduced <a href='../../html/page?content/blog/2016-06-14-How-to-use-Ridge-Regression-and-Lasso-in-R'>in this post</a>, in case you don't know the method, please read about it <a href='../../html/page?content/blog/2016-06-14-How-to-use-Ridge-Regression-and-Lasso-in-R'>here</a> before!

---

## Oracle Procedure

Before we enter the Adaptive Lasso it is important to know what is a procedure known as "Oracle".

An oracle procedure is one that has the following oracle properties:

- Identifies the right subset of true variables; and
- Has optimal estimation rate.

Some studies <a href='http://pages.cs.wisc.edu/~shao/stat992/zou2006.pdf'>(Zou 2006)</a> state that the Lasso does not have the oracle properties. They claim that there are cases where a given $\lambda$ that leads to optimal estimation rate ends up with inconsistent selection of variables (for example, includes noise variables). Similarly, there are also cases with the right selection of variables but showing biased estimates for large coefficients, leading to suboptimal prediction rates.

Therefore, seeing that the Lasso is not an oracle procedure, Adaptive Lasso was developed to address this issue.

---

## Adaptive Lasso

Adaptive Lasso is an evolution of the Lasso that has the oracle properties (for a suitable choice of $\lambda$).

Adaptive Lasso, as a regularization method, avoids overfitting penalizing large coefficients. Besides, it has the same advantage that Lasso: it can shrink some of the coefficients to exactly zero, performing thus a selection of attributes with the regularization.

In a linear regression, the Adaptive Lasso seeks to minimize:

$ RSS(\beta) + \lambda \sum_{j=1}^{p} \hat{\omega_j} |\beta_j| $

where $\lambda$ is the tuning parameter (chosen through 10-fold cross validation), $\beta_j$ are the estimated coefficients, existing $p$ of them. Furthermore, we see $\hat{\omega_j}$, called Adaptive Weights vector, the edge of the Adaptive Lasso.

With $\hat{\omega_j}$ we are performing a different regularization for each coefficient, i.e., this vector adjusts the penalty differently for each coefficient. The Adaptive Weights vector is defined as:

$\hat{\omega_j} = \frac{1}{\left(|\hat{\beta_j}^{ini}|\right)^{\gamma}}$

In the above equation $\hat{\beta_j}^{ini}$ is an initial estimate of the coefficients, usually obtained through <a href='../../html/page?content/blog/2016-06-14-How-to-use-Ridge-Regression-and-Lasso-in-R'>Ridge Regression</a>. So Adaptive Lasso ends up penalizing more those coefficients with lower initial estimates.

Whereas $\gamma$ is a positive constant for adjustment of the Adaptive Weights vector, and the authors suggest the possible values of $0.5$, $1$ and $2$.

---

## Adaptive Lasso in R

To run Adaptive Lasso in R, we will use the glmnet package, performing <a href='../../html/page?content/blog/2016-06-14-How-to-use-Ridge-Regression-and-Lasso-in-R'>Ridge Regression</a> to create the Adaptive Weights vector, as shown below.

```R
require(glmnet)
## Data = considering that we have a data frame named dataF, with its first column being the class
x <- as.matrix(dataF[,-1]) # Removes class
y <- as.double(as.matrix(dataF[, 1])) # Only class

## Ridge Regression to create the Adaptive Weights Vector
set.seed(999)
cv.ridge <- cv.glmnet(x, y, family='binomial', alpha=0, parallel=TRUE, standardize=TRUE)
w3 <- 1/abs(matrix(coef(cv.ridge, s=cv.ridge$lambda.min)
[, 1][2:(ncol(x)+1)] ))^1 ## Using gamma = 1
w3[w3[,1] == Inf] <- 999999999 ## Replacing values estimated as Infinite for 999999999

## Adaptive Lasso
set.seed(999)
cv.lasso <- cv.glmnet(x, y, family='binomial', alpha=1, parallel=TRUE, standardize=TRUE, type.measure='auc', penalty.factor=w3)
plot(cv.lasso)
plot(cv.lasso$glmnet.fit, xvar="lambda", label=TRUE)
abline(v = log(cv.lasso$lambda.min))
abline(v = log(cv.lasso$lambda.1se))
coef(cv.lasso, s=cv.lasso$lambda.1se)
coef <- coef(cv.lasso, s='lambda.1se')
selected_attributes <- (coef@i[-1]+1) ## Considering the structure of the data frame dataF as shown earlier
```

In the above code, we execute logistic regression (note the family='binomial'), in parallel (if a cluster or cores have been previously allocated), internally standardizing (needed for more appropriate regularization) and wanting to observe the results of AUC (area under ROC curve). Moreover, the method already performs 10-fold cross validation to choose the best $\lambda$.

Fixing $\gamma = 1$ (might be useful to vary it between the suggested values: 0.5, 1 and 2), we apply the Adaptive Weights vector on the cv.glmnet function using the argument **penalty.factor**.

At the end, there are some useful commands to verify the results, like plots of the AUC results and values of minimum $\lambda$ (for minimum AUC) and 1 std. error (for AUC lower than minimum by one standard deviation), besides plot of the regularization perfomed.

---

That's it! Adaptive Lasso can be very useful, so do not hesitate to test it!

Any questions, suggestions: please comment!

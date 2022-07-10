import chalk from 'chalk'

export default class Logger {
    public log = console.log
    public err = (l:any) => this.log(chalk.red(l))
	public blu = (l: any) => this.log(chalk.blue(l))
    public red = (l: any) => this.log(chalk.red(l))
	public ylw = (l:any) => this.log(chalk.yellow(l))
	public grn = (l:any) => this.log(chalk.green(l))
	public mgt = (l:any) => this.log(chalk.magenta(l))
	public gry = (l:any) => this.log(chalk.gray(l))
}